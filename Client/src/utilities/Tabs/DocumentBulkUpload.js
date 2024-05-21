//DocumentBulkUpload.js
import React, {useState, useEffect} from "react";
import * as XLSX from 'xlsx';
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.css';
import { DOMAIN } from "../../Constant";

function DocumentBulkUpload() {
let [excelFile, setExcelFile] = useState(null);
let [zipFile, setZipFile] = useState(null);

let handleDownloadClick = () =>{
    // Reference the Excel file in the public/template folder
    let excelFileUrl = process.env.PUBLIC_URL + `/template/documentbulkuploadtemplate.xlsx`;
    // Create a dummy anchor element to trigger the download
    let anchor = document.createElement('a');
    anchor.href = excelFileUrl;
    anchor.download = `documentbulkuploadtemplate.xlsx`; // Set the desired file name
    anchor.style.display = 'none';
    // Append the anchor to the document and trigger a click event
    document.body.appendChild(anchor);
    anchor.click();
    // Remove the anchor from the document
    document.body.removeChild(anchor);
};

let isExcelFile = (file) => {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
};

let readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: 'array' });
            resolve(workbook);
        };
        reader.readAsArrayBuffer(file);
    });
};

let handleFileChange = async(event) => {
    let file = event.target.files[0];
    if(file) {
        if(isExcelFile(file)) {
            try {
                let workbook = await readExcelFile(file);
                let sheetName = workbook.SheetNames[0];
                let worksheet = workbook.Sheets[sheetName];
                let range = XLSX.utils.decode_range(worksheet['!ref']);
                if(range.e.r >= range.s.r + 1) {
                    for(let rowIndex = range.s.r + 2; rowIndex <= range.e.r; rowIndex++) {
                        let requiredColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
                        let isRowValid = requiredColumns.every(column => {
                            let cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: column.charCodeAt(0) - 65 })];
                            return cell && cell.v !== undefined && cell.v !== null && cell.v.toString().trim() !== '';
                        });
                        if (!isRowValid) {
                            console.log(`Row ${rowIndex + 1} has missing values in required columns.`);
                            alert(`Please fill all required columns (A, B, D, E, F, G, H, I) for row ${rowIndex + 1} in the Excel file.`);
                            return; // Stop processing further rows if any row is invalid
                        }
                    }
                    setExcelFile(file);
                } else {
                    alert('Not enough data rows found below the headers. <br/> Please upload a valid Excel file with data.');
                }
            } catch (error) {
                alert('An error occurred while processing the Excel file.');
                console.error(error);
            }
        } else {
            alert('Please upload a valid Excel file with data.');
            // Clear the file input field
            event.target.value = '';
        }
    }
    console.log('Exiting handleFileChange');
};

let handleZipFileChange = (event) => {
    let file = event.target.files[0];
    if(file) {
        let allowedExtensions = ['.zip'];
        let fileName = file.name.toLowerCase();
        let isValidExtension = allowedExtensions.some(extension => fileName.endsWith(extension));
        if(isValidExtension) {
            setZipFile(file);
        } else {
            alert('Please select a valid ZIP file');
            // Clear the file input field
            event.target.value = '';
        }
    }
};

let showAlert = (arg, icon='info') => {
    Swal.fire({
      title: arg,
      text: arg,
      icon: icon,
      confirmButtonText: 'OK',
    });
}; 

let handleUploadClick = async (e) => {
    console.log(e.target.id);
    if (excelFile && zipFile) {
        try {
            let workbook = await readExcelFile(excelFile);
            let sheetName = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[sheetName];
            let excelData = XLSX.utils.sheet_to_json(worksheet);

            // Convert date strings to YYYY-MM-DD format
            let formattedExcelData = excelData.map(item => ({
                "project_name": item.project_name,
                "assignNameOftaggers": item.assignNameOftaggers
            }));

            let formDataExl = new FormData();
            formDataExl.append('excelData', JSON.stringify(excelData))
            await axios.post(`${DOMAIN}/api/excelupload`, formDataExl, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(async(resExcel) => {
                console.log(resExcel);
                try {
                    let formData = new FormData();
                    formData.append('zipFileDoc', zipFile);
                    formData.append('body', JSON.stringify(excelData));
                    await axios.post(`${DOMAIN}/api/commzipextraction`, formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    }).then((resZip) => {
                        showAlert(resZip.data, 'success');
                    }).catch(async(error) => {
                        showAlert(error.response.data.message, 'error');
                        await axios.delete(`${DOMAIN}/delZipTask`, {
                            data: {
                                details: formattedExcelData
                            }
                        }).then((delRes) => {
                            console.log("Data has been deleted");
                            setExcelFile(null);
                            setZipFile(null);
                        }).catch(error => {
                            console.log(error);
                        });
                    });                  
                } catch (error) {
                    console.error('Error during upload:', error);
                }
            }).catch(error => {
                // Handle the error, e.g., display an error message to the user
                console.error('Upload failed:', error);                
                showAlert(error, 'error');
            });
        } catch (error) {
            // Handle the error, e.g., display an error message to the user
            console.error('Error during upload:', error);
        }        
    } else {
        alert('Please select both an Excel file and a ZIP file before uploading.');
    }
};

useEffect(() => {
    console.log('Excel file selected.');
}, [excelFile]);

useEffect(() => {
    console.log('4ZIP file selected.');
}, [zipFile]);

return (
    <div className=''>
        <button
            id="downloadTopButton"
            style={{
                width: '240px',
                height: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0074cc',
            }}
            onClick={handleDownloadClick}
        >
            Download Documents Template
        </button>
        <div>
            <div>
                <span style={{ marginRight: '10px' }}>Upload the Excel:</span>
                <input type="file" onChange={handleFileChange} accept= ".*"/>
            </div>
        </div>
        <br></br>
        <div>
            <div>
                <span style={{ marginRight: '20px' }}>Upload the ZIP:</span>
                <input type="file" onChange={handleZipFileChange} accept=".zip" />
            </div>
        </div>
        {/* Upload button at the bottom */}
        <button
            id="uploadImageButton"
            style={{
                width: '250px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0074cc',
            }}
            onClick={handleUploadClick}
        >
            Upload
        </button>
        
    </div>
);

}//End of function

export default DocumentBulkUpload;
