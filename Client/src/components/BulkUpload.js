import React from 'react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

function BulkUpload() {
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
    const isColumnFilled = (worksheet, column) => {
        if (!worksheet || !worksheet['!ref']) {
            return false; // No worksheet or reference is defined
        }
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const columnIndex = XLSX.utils.decode_col(column);
         for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: columnIndex });
            const cell = worksheet[cellAddress];
            if (!cell || !cell.v) {
                return false; // Cell is empty, not all cells in the column are filled
            }
        }
        return true; // All cells in the column are filled
    };
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const workbook = await readExcelFile(file);
                const sheetName = workbook.SheetNames[0]; // Use the first sheet name
                const worksheet = workbook.Sheets[sheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                if (range.e.r > range.s.r) {
                    // There is at least one data row, check columns 'A' and 'B'
                    const isCol1Filled = isColumnFilled(worksheet, 'A');
                    const isCol2Filled = isColumnFilled(worksheet, 'B');
                    if (isCol1Filled && isCol2Filled) {
                        console.log('Columns A and B are filled.');
                    } else {
                        console.log('Columns A and/or B are not filled.');
                        alert('Please upload a valid Excel file with data.');
                    }
                } else {
                    console.log('No data rows found below the headers.');
                    alert('Please upload a valid Excel file with data.');
                }
            } catch (error) {
                alert('An error occurred while processing the Excel file.');
                console.error(error);
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
            } else {
                alert('Please select a valid ZIP file');
                // Clear the file input field
                event.target.value = '';
            }
        }
    };
    return (
        <div>
            {/* Download button at the top */}
            <button id="downloadTopButton" style={{
                width: '250px', height: '30px', display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0074cc'
            }}
                onClick={handleDownloadClick}>Download Template</button>
            <div>
                <div ><span style={{ marginRight: '10px' }}>Upload the Excel:</span>
                    <input type="file" onChange={handleFileChange} />
                </div>
            </div><br></br>
            <div>
                <div ><span style={{ marginRight: '20px' }}>Upload the ZIP:</span>
                    <input type="file" onChange={handleZipFileChange} />
                </div>
            </div>
            {/* Download button at the bottom */}
            <button id="downloadBottomButton" style={{
                width: '250px', height: '30px', display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0074cc'
            }}>Upload</button>
        </div>
    );
}
export default BulkUpload