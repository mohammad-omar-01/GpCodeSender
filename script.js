// Establish a connection with GRBL over a serial port (You need to implement this part)

// Function to send commands to GRBL
function sendCommand(command) {
    serialPort.write(`${command}\n`);
}

// Button event listeners
document.getElementById('homing-btn').addEventListener('click', () => {
    sendCommand('$H'); // Send homing command
});

document.getElementById('unlock-btn').addEventListener('click', () => {
    sendCommand('$X'); // Send unlock command
});

let serialPort = null; // Holds the reference to the serial port

// Function to send commands to GRBL
async function sendCommand(command) {
    if (serialPort) {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(`${command}\n`);
        await serialPort.write(data);
    }
}

// Function to handle file upload
async function handleFileUpload(file) {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const fileContent = event.target.result;
        const lines = fileContent.split('\n');

        async function sendGCodeLine(line) {
            await sendCommand(line);
        }

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.length > 0) {
                await sendGCodeLine(trimmedLine);
            }
        }
    };

    reader.readAsText(file);
}

document.getElementById('UploadGcodeFile-btn').addEventListener('click', async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt'; // Only accept text files
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            await handleFileUpload(uploadedFile);
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
});

// Open the serial port when a button is clicked
document.getElementById('OpenSerialPort-btn').addEventListener('click', async () => {
    try {
        serialPort = await requestSerialPort();
        await serialPort.open({ baudRate: 115200 });
        console.log('Serial port opened successfully');
    } catch (error) {
        console.error('Error opening serial port:', error);
    }
});
