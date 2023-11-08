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
    // const handleFileChange = async (event) => {
    //     const file = event.target.files[0];
    //     if (file) {

    //         if (isExcelFile(file)) {
    //             try {
    //                 const workbook = await readExcelFile(file);
    //                 const sheetName = workbook.SheetNames[0]; // Use the first sheet name
    //                 const worksheet = workbook.Sheets[sheetName];
    //                 const range = XLSX.utils.decode_range(worksheet['!ref']);
    //                 if (range.e.r > range.s.r) {
    //                     // There is at least one data row, check columns 'A' and 'B'
    //                     let isCol1Filled = false;
    //                     let isCol2Filled = false;
    //                     let isCol4Filled = false;
    //                     let isCol5Filled = false;
    //                     let isCol6Filled = false;
    //                     let isCol7Filled = false;
    //                     let isCol8Filled = false;
    //                     let isCol9Filled = false;


    //                     for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
    //                         const cellA = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })];
    //                         const cellB = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })];
    //                         const cellD = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })];
    //                         const cellE = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })];
    //                         const cellF = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 5 })];
    //                         const cellG = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 6 })];
    //                         const cellH = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 7 })];
    //                         const cellI = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 8 })];

    //                         if (cellA && cellA.v) {
    //                             isCol1Filled = true;
    //                         }

    //                         if (cellB && cellB.v) {
    //                             isCol2Filled = true;
    //                         }

    //                         if (cellD && cellD.v) {
    //                             isCol4Filled = true;
    //                         }
    //                         if (cellE && cellE.v) {
    //                             isCol5Filled = true;
    //                         }
    //                         if (cellF && cellF.v) {
    //                             isCol6Filled = true;
    //                         }
    //                         if (cellG && cellG.v) {
    //                             isCol7Filled = true;
    //                         }
    //                         if (cellH && cellH.v) {
    //                             isCol8Filled = true;
    //                         }
    //                         if (cellI && cellI.v) {
    //                             isCol9Filled = true;
    //                         }

    //                         if (isCol1Filled, isCol2Filled, isCol4Filled, isCol5Filled, isCol6Filled, isCol7Filled, isCol8Filled && isCol9Filled) {
    //                             break; // Both columns are filled, no need to check further
    //                         }
    //                     }
    //                     if (isCol1Filled, isCol2Filled, isCol4Filled, isCol5Filled, isCol6Filled, isCol7Filled, isCol8Filled && isCol9Filled) {
    //                         console.log('All Columns are filled.');
    //                         setExcelFile(file);
    //                         console.log('Excel file selected:', excelFile);
    //                     } else {
    //                         console.log('All columns are not filled.');
    //                         alert('Please upload a valid Excel file with data.');
    //                     }
    //                 } else {
    //                     console.log('No data rows found below the headers.');
    //                     alert('Please upload a valid Excel file with data.');
    //                 }
    //                 // ... Your existing Excel validation code ...
    //             } catch (error) {
    //                 alert('An error occurred while processing the Excel file.');
    //                 console.error(error);
    //             }
    //         } else {
    //             alert('Please upload a valid Excel file with data.');
    //             // Clear the file input field
    //             event.target.value = '';
    //         }
    //     }
    // };

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
                        // There is at least one data row, check columns A, B, D, E, F, G, H, and I
                        let isColAEmpty = true;
                        let isColBEmpty = true;
                        let isColDEmpty = true;
                        let isColEEmpty = true;
                        let isColFEmpty = true;
                        let isColGEmpty = true;
                        let isColHEmpty = true;
                        let isColIEmpty = true;
    
                        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
                            const cellA = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })];
                            const cellB = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })];
                            const cellC = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })];
                            const cellD = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })];
                            const cellE = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })];
                            const cellF = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 5 })];
                            const cellG = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 6 })];
                            const cellH = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 7 })];
                            const cellI = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 8 })];
    
                            if (cellA && cellA.v) {
                                isColAEmpty = false;
                            }
    
                            if (cellB && cellB.v) {
                                isColBEmpty = false;
                            }
    
                            if (cellD && cellD.v) {
                                isColDEmpty = false;
                            }
                            if (cellE && cellE.v) {
                                isColEEmpty = false;
                            }
                            if (cellF && cellF.v) {
                                isColFEmpty = false;
                            }
                            if (cellG && cellG.v) {
                                isColGEmpty = false;
                            }
                            if (cellH && cellH.v) {
                                isColHEmpty = false;
                            }
                            if (cellI && cellI.v) {
                                isColIEmpty = false;
                            }
                        }
    
                        if (isColAEmpty || isColBEmpty || isColDEmpty || isColEEmpty || isColFEmpty || isColGEmpty || isColHEmpty || isColIEmpty) {
                            console.log('Some required columns are empty.');
                            alert('Please fill all required columns (A, B, D, E, F, G, H, I) in the Excel file.');
                        } else {
                            console.log('All required columns are filled.');
                            setExcelFile(file);
                            console.log('Excel file selected:', excelFile);
                        }
                    } else {
                        console.log('No data rows found below the headers.');
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

    const handleUploadClick = async () => {
        if (excelFile && zipFile) {
            try {
                const workbook = await readExcelFile(excelFile);
                const sheetName = workbook.SheetNames[0]; // Use the first sheet name
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet);

                // const formData = new FormData();
                // formData.append('excelFile', excelFile);
                // formData.append('excelData', JSON.stringify(excelData));
                // console.log("formdata:", formData)
                // console.log('excelData:', excelData);
                const requestBody = {
                    excelData: excelData,
                };
                console.log("exceldata:", excelData);

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