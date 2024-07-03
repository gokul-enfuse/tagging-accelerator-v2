import React from 'react';
import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import BulkUploadTabs from './BulkUploadTabs';
const port = 3030;

function BulkUpload() {

    const [excelFile, setExcelFile] = useState(null);
    const [zipFile, setZipFile] = useState(null);

    const handleDownloadClick = () => {
        // Reference the Excel file in the public/template folder
        const excelFileUrl = process.env.PUBLIC_URL + `/template/bulkuploadtemplate.xlsx`;
        // Create a dummy anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = excelFileUrl;
        anchor.download = `bulkuploadtemplate.xlsx`; // Set the desired file name
        anchor.style.display = 'none';
        // Append the anchor to the document and trigger a click event
        document.body.appendChild(anchor);
        anchor.click();
        // Remove the anchor from the document
        document.body.removeChild(anchor);
    };
    const isExcelFile = (file) => {
        return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
    };
     
const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        if (isExcelFile(file)) {
            try {
                const workbook = await readExcelFile(file);
                const sheetName = workbook.SheetNames[0]; // Use the first sheet name
                const worksheet = workbook.Sheets[sheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                if (range.e.r >= range.s.r + 1) {
                    for (let rowIndex = range.s.r + 2; rowIndex <= range.e.r; rowIndex++) {
                        //const requiredColumns = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I'];
                        const requiredColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

                        const isRowValid = requiredColumns.every(column => {
                            const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: column.charCodeAt(0) - 65 })];
                            return cell && cell.v !== undefined && cell.v !== null && cell.v.toString().trim() !== '';
                        });
                        if (!isRowValid) {
                           // console.log(`Row ${rowIndex + 1} has missing values in required columns.`);
                            alert(`Please fill all required columns (A, B, D, E, F, G, H, I) for row ${rowIndex + 1} in the Excel file.`);
                            return; // Stop processing further rows if any row is invalid
                        }
                    }

                    //alert('All rows starting from the third row have valid data in required columns.');
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

const handleZipFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Check if the selected file has a valid ZIP file extension
        const allowedExtensions = ['.zip'];
        const fileName = file.name.toLowerCase();
        const isValidExtension = allowedExtensions.some(extension => fileName.endsWith(extension));
        if (isValidExtension) {
            // Handle the valid ZIP file here
            setZipFile(file);
        } else {
            alert('Please select a valid ZIP file');
            // Clear the file input field
            event.target.value = '';
        }
    }
};

const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            resolve(workbook);
        };
        reader.readAsArrayBuffer(file);
    });
};

const showAlert = (arg, icon='info') => {
    Swal.fire({
      title: arg,
      text: arg,
      icon: icon,
      confirmButtonText: 'OK',
    });
};    

const handleUploadClick = async (e) => {
    if (excelFile && zipFile) {
        try {
            const workbook = await readExcelFile(excelFile);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const excelData = XLSX.utils.sheet_to_json(worksheet);

            // Convert date strings to YYYY-MM-DD format
            const formattedExcelData = excelData.map(item => ({
                "project_name": item.project_name,
                "assignNameOftaggers": item.assignNameOftaggers
            }));

            const formDataExl = new FormData();
            formDataExl.append('excelData', JSON.stringify(excelData))
            await axios.post('http://localhost:3030/api/excelupload', formDataExl, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(async(resExcel) => {
                try {
                    const formData = new FormData();
                    formData.append('zipFile', zipFile);
                    formData.append('body', JSON.stringify(excelData));

                    await axios.post(`http://localhost:${port}/zipextraction`, formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    }).then((resZip) => {
                        showAlert(resZip.data, 'success');
                    }).catch(async(error) => {
                        showAlert(error.response.data.message, 'error');
                        await axios.delete(`http://localhost:${port}/delZipTask`, {
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
                    })                    
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
        <div className='bulkupload'>
            <BulkUploadTabs />
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
                Download Template
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
}
export default BulkUpload;
