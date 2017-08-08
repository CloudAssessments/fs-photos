
File System Photo Upload Service
===================

PO: Anthony James

A single-project demo to enable users to get and upload photos to their local filesystem


## Development Installation
1. Clone the repository into your local machine
1. Go into the new folder `fs-photos` folder and run `npm install` to install all the packages.

## Development Deployment

### Using your local machine
1. Install via `Development Installation` instructions
1. Run `npm run dev` to start a development web-app

### Using Docker-Compose
1. Build the image: `docker-compose build`
1. Run `docker-compose up`

### Verifying Deployment
1. Navigate to the web-client homepage at [localhost:3000](localhost:3000)
2. Select an image file (jpeg, png, bmp only) and upload
3. Observe the image has had a greyscale filter applied to it and added to the list of images

## Environment Variables
### Environment Variable Reference
- `PORT`:
  - Default: "3000"
  - Description: The port number to listen on
- `UPLOAD_DIR`:
  - Default: "uploads"
  - Description:  The local directory to store the uploaded images. **Note: This directory must already exist before running the web-app**

### Debugging Endpoint
Navigate to `localhost:3000/debug/app-vars` to view relevant environment and app variables used in the web-app during runtime