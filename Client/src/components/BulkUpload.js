import React from 'react';
import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';

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
        const file = event.target.files[0];
        if (file) {

            if (isExcelFile(file)) {
                try {
                    const workbook = await readExcelFile(file);
                    const sheetName = workbook.SheetNames[0]; // Use the first sheet name
                    const worksheet = workbook.Sheets[sheetName];
                    const range = XLSX.utils.decode_range(worksheet['!ref']);
                    if (range.e.r > range.s.r) {
                        // There is at least one data row, check columns 'A' and 'B'
                        let isCol1Filled = false;
                        let isCol2Filled = false;

                        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
                            const cellA = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })];
                            const cellB = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })];

                            if (cellA && cellA.v) {
                                isCol1Filled = true;
                            }

                            if (cellB && cellB.v) {
                                isCol2Filled = true;
                            }

                            if (isCol1Filled && isCol2Filled) {
                                break; // Both columns are filled, no need to check further
                            }
                        }
                        if (isCol1Filled && isCol2Filled) {
                            console.log('Columns A and B are filled.');
                            setExcelFile(file);
                            console.log('Excel file selected:', excelFile);
                        } else {
                            console.log('Columns A and/or B are not filled.');
                            alert('Please upload a valid Excel file with data.');
                        }
                    } else {
                        console.log('No data rows found below the headers.');
                        alert('Please upload a valid Excel file with data.');
                    }
                    // ... Your existing Excel validation code ...
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

    const handleUploadClick = () => {
        if (excelFile && zipFile) {
            // Both Excel and ZIP files are selected, proceed with the upload logic
            console.log('Both Excel and ZIP files are selected:', excelFile, zipFile);
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
        <div>
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
                    <input type="file" onChange={handleFileChange} accept=".xls, .xlsx" />
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