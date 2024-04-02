import sys
import zipfile

# Define the path to the ZIP file
#zip_file_path = 'C:/Users/Vikas.Bose/Desktop/car_bazar.zip'
zip_file_path = sys.argv[1]
print(zip_file_path)

# Specify the directory where you want to extract the contents
#extract_to_directory = 'D:/Project - Internal/TaggingTool/one-dev/taggingTool-V2/public/uploads/images/extracted_files'
extract_to_directory = sys.argv[2]
print(extract_to_directory)

# Create a ZipFile object
with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
    # Extract all the contents of the ZIP file to the specified directory
    zip_ref.extractall(extract_to_directory)
