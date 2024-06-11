import React from "react";
import * as XLSX from 'xlsx';
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2';
import { DOMAIN } from "../../Constant";

export async function handleUpload(e, excelFile, zipFile) {
    const showAlert = (arg, icon='info') => {
        Swal.fire({
          title: arg,
          text: arg,
          icon: icon,
          confirmButtonText: 'OK',
        });
    }; 
    if(excelFile && zipFile) {
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
            formDataExl.append('excelData', JSON.stringify(excelData));
            await axios.post(`http://localhost:3030/api/excelupload`, formDataExl, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(async(resExcel) => { ///api/commzipextraction
                try {
                    const formData = new FormData();
                    formData.append('zipFile', zipFile);
                    formData.append('body', JSON.stringify(excelData));

                    await axios.post(`${DOMAIN}/api/commzipextraction`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(resZip => {
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
                    })
                } catch(error) {
                    console.error('Error during upload:', error);
                }
            }).catch(error => {
                console.error('Upload failed:', error);                
                showAlert(error, 'error');
            })
        }catch(error) {
            console.error('Error during upload:', error);
        }
    } else {
        alert('Please select both an Excel file and a ZIP file before uploading.');
    }
}