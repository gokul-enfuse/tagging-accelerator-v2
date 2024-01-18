import React from 'react';
import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';
import { parse, format } from 'date-fns';

function BulkUpload() {

    const [excelFile, setExcelFile] = useState(null);
    const [zipFile, setZipFile] = useState(null);
    const handleDownloadClick = () => {
        // Reference the Excel file in the public/template folder
        const excelFileUrl = process.env.PUBLIC_URL + '/template/bulkuploadtemplate.xlsx';
        // Create a dummy anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = excelFileUrl;
        anchor.download = 'bulkuploadtemplate.xlsx'; // Set the desired file name
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
    const isColumnFilled = (worksheet, column) => {
        // ... Your existing Excel validation code ...
    };
     
const handleFileChange = async (event) => {

    console.log('Entering handleFileChange');
    const file = event.target.files[0];
    console.log('File:', file);
    if (file) {
        if (isExcelFile(file)) {
            try {
                const workbook = await readExcelFile(file);
                const sheetName = workbook.SheetNames[0]; // Use the first sheet name
                const worksheet = workbook.Sheets[sheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']);

                if (range.e.r > range.s.r + 1) {
                    for (let rowIndex = range.s.r + 2; rowIndex <= range.e.r; rowIndex++) {
                        const requiredColumns = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I'];

                        const isRowValid = requiredColumns.every(column => {
                            const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: column.charCodeAt(0) - 65 })];
                            return cell && cell.v !== undefined && cell.v !== null && cell.v.toString().trim() !== '';
                        });

                        

                        if (!isRowValid) {
                            console.log(`Row ${rowIndex + 1} has missing values in required columns.`);
                            alert(`Please fill all required columns (A, B, D, E, F, G, H, I) for row ${rowIndex + 1} in the Excel file.`);
                            return; // Stop processing further rows if any row is invalid
                        }
                    }

                    console.log('All rows starting from the third row have valid data in required columns.');
                    setExcelFile(file);
                    console.log('Excel file selected:', excelFile);
                } else {
                    console.log('Not enough data rows found below the headers.');
                    alert('Please upload a valid Excel file with data.');
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

const formatDate = (excelDate) => {
    const date = new Date((excelDate - (25567 + 1)) * 86400 * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
                console.log('Valid ZIP file selected:', file);
                setZipFile(file);
                console.log('zip file selected:', zipFile);
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

    // const handleUploadClick = () => {
    //     if (excelFile && zipFile) {
    //         // Both Excel and ZIP files are selected, proceed with the upload logic
    //         console.log('Both Excel and ZIP files are selected:', excelFile, zipFile);
    //     } else {
    //         alert('Please select both an Excel file and a ZIP file before uploading.');
    //     }
    // };

    // const handleUploadClick = async () => {
    //     if (excelFile && zipFile) {
    //         // Create a FormData object to send the files
    //         const formData = new FormData();
    //         formData.append('excelFile', excelFile);
    //         formData.append('zipFile', zipFile);

    //         try {
    //             // Make an HTTP POST request to the server's upload endpoint
    //             const response = await fetch('/api/excelupload', {
    //                 method: 'POST',
    //                 body: formData,
    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 console.log('Upload successful:', data);
    //                 // Handle success, e.g., display a success message to the user
    //             } else {
    //                 console.error('Upload failed:', response.status);
    //                 // Handle the error, e.g., display an error message to the user
    //             }
    //         } catch (error) {
    //             console.error('Error during upload:', error);
    //             // Handle the error, e.g., display an error message to the user
    //         }
    //     } else {
    //         alert('Please select both an Excel file and a ZIP file before uploading.');
    //     }
    // };

    // const handleUploadClick = async () => {
    //     if (excelFile && zipFile) {
    //         try {
    //             const workbook = await readExcelFile(excelFile);
    //             const sheetName = workbook.SheetNames[0]; // Use the first sheet name
    //             const worksheet = workbook.Sheets[sheetName];
    //             const excelData = XLSX.utils.sheet_to_json(worksheet);

    //             // const formData = new FormData();
    //             // formData.append('excelFile', excelFile);
    //             // formData.append('excelData', JSON.stringify(excelData));
    //             // console.log("formdata:", formData)
    //             // console.log('excelData:', excelData);
    //             const requestBody = {
    //                 excelData: excelData,
    //             };
    //             console.log("exceldata:", excelData);

    //             const response = await fetch('http://localhost:3030/api/excelupload', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(requestBody),

    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 console.log('Upload successful:', data);
    //                 // Handle success, e.g., display a success message to the user
    //             } else {
    //                 console.error('Upload failed:', response.status);
    //                 // Handle the error, e.g., display an error message to the user
    //             }
    //         } catch (error) {
    //             console.error('Error during upload:', error);
    //             // Handle the error, e.g., display an error message to the user
    //         }
    //     } else {
    //         alert('Please select both an Excel file and a ZIP file before uploading.');
    //     }
    // };

 // Helper function to format date strings to YYYY-MM-DD
 const formatDateToYYYYMMDD = (dateString) => {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};
    const handleUploadClick = async () => {
        if (excelFile && zipFile) {
            try {
                const workbook = await readExcelFile(excelFile);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet);
    
                // Convert date strings to YYYY-MM-DD format
                const formattedExcelData = excelData.map(item => ({
                    ...item,
                    createdDate: formatDateToYYYYMMDD(item.createdDate),
                    modifiedDate: formatDateToYYYYMMDD(item.modifiedDate),
                }));
    
                const requestBody = {
                    excelData: formattedExcelData,
                };
    
                console.log("Formatted excel data:", formattedExcelData);
    
                const response = await fetch('http://localhost:3030/api/excelupload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Upload successful:', data);
                    // Handle success, e.g., display a success message to the user
                } else {
                    console.error('Upload failed:', response.status);
                    // Handle the error, e.g., display an error message to the user
                }
            } catch (error) {
                console.error('Error during upload:', error);
                // Handle the error, e.g., display an error message to the user
            }
        } else {
            alert('Please select both an Excel file and a ZIP file before uploading.');
        }
    };
    
   
    
    useEffect(() => {
        console.log('1Excel file selected:', excelFile);
    }, [excelFile]);

    useEffect(() => {
        console.log('4ZIP file selected:', zipFile);
    }, [zipFile]);
    return (
        <div className='bulkupload'>
            {/* Download button at the top */}
            <button
                id="downloadTopButton"
                style={{
                    width: '250px',
                    height: '30px',
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
                id="uploadButton"
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