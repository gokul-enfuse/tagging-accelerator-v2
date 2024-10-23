import schedule
import time
import subprocess
import os

os_name = os.name
print(f"Operating System: {os_name}")

os_path = "server.js"
os_win_path = "D:/Project - Internal/TaggingTool/Prod-site/tagging-accelerator-v2/Server"
os_linux_path = "/home/devel1/applications/tagging-accelerator-v2/Server"

# Function to restart Node.js server
def restart_node_server():
    print("Restarting Node.js server...")
    try:
        # Command to stop the Node.js server (replace this with your actual command)
        if os_name == 'nt':
            f_command = ["taskkill", "/F", "/IM", "node.exe"]
            subprocess.run(f_command, check=True)  # Assuming you're using pkill to stop Node.js
            print("Node processes terminated.")

            # Command to start the Node.js server (replace this with your actual command shell=True, capture_output=True, text=True)
            result = subprocess.run(["node", os_path], cwd=os_win_path,  check=True)        
            print("Node.js server restarted successfully.")
             # Print output and error (if any)
            print("Output:\n", result.stdout)
            print("Error:\n", result.stderr)
        else :
            f_command = ["pkill", "node"]
            # Change to the target directory
            os.chdir(os_linux_path)
            subprocess.run(f_command, cwd=os_linux_path, check=True, bufsize=1)  # Assuming you're using pkill to stop Node.js
            print("Node processes terminated.")

            # Run a Node.js command, for example, running a specific script or `node -v`
            s_command = ["node", os_path]
            # Use subprocess to execute the command
            result = subprocess.run(s_command, cwd=os_linux_path, check=True, bufsize=1)        
            print("Node.js server restarted successfully.")
             # Print output and error (if any)
            print("Output:\n", result.stdout)
            print("Error:\n", result.stderr)     
        
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

# Schedule the job to run every day at 2 AM (change as needed)
schedule.every().day.at("11:41").do(restart_node_server)

# Loop to keep the scheduler running
while True:
    try:
        schedule.run_pending()
        time.sleep(1)
    except KeyboardInterrupt:
        print("Process interrupted")
