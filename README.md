# flash

## Overview
This repository contains a Max patch specifically designed for flashing the Arduino Nano 33 IoT with code developed and used by the Wearable Computing Group. 

## Features of the Max Package
- **Arduino Code Generation**: Automatically generates Arduino code for transmitting sensor data to Max, configurable for a specific network, IP, and UDP port via OSC.
- **Library and Core Downloads**: Automates the process of downloading necessary Arduino libraries and the Arduino Nano 33 IoT core directly into your `/Documents/Arduino/` directory.
- **Code Compilation and Upload**: Compiles and uploads the generated code to an Arduino Nano 33 IoT connected to your computer through a USB connection.

## Quickstart Guide
1. **Clone the Repository**: Clone this repository to the `/Documents/Max 8/Packages/` directory on your machine.
2. **Open the Patch**: Navigate to `/Documents/Max 8/Packages/flash/` and open the `flash.maxpat` file in Max.
3. **Configure WiFi Details**: Enter your WiFi credentials and select the connected Arduino Nano 33 IoT from the dropdown menu.
4. **Begin Flashing**: Click on the "Flash" button to start the process.

## Important Note
- **Development Status**: This project is currently in the development stage and has not been fully tested. If you encounter any issues, please report them by creating an issue in this repository.
