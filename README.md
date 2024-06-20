This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Frontend Client

Welcome to the Validation Hub's frontend client! For users looking to inform us about issues with the client, please see the issues section at the bottom for instructions on filing issues here on our github page. For developers and contributors, please see the getting started section below!

## Getting Started

The frontend client has three distinct working modes: analysis development, local development, and production.The analysis developmental mode lacks most of the features of the validation hub, but it allows the developer to build and run the client as a standalone system to quickly build out an analysis' documentation structure. For local and production development, please see the docs on the main ![pv-validation-hub](https://github.com/slacgismo/pv-validation-hub) repository.

## Analysis Development

First, you will need to clone this repository to your local system and make a branch or fork. Additionally, you will need to have node and npm installed and up-to-date on your system.

You can follow the instruction ![here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install both dependencies.

Next, you will open your shell and navigate into your repository. Then you can run the following commands:
```
npm install
npm run dev
```

These commands will install all the repository dependencies and then run a development version of the client. If nothing is occupying port 3000, you can view your local instance at localhost:3000 in the browser. If it is occupied, the there will be a link in the shell output to the port it is being hosted on.

### Adding an Analysis

All analyses and their related files are stored in `<path-to-repo>/public/static/assets`. In analysis development mode, the `development` subdirectory directory is the only directory used. As all analyses are referenced based their primary key, you will want to create a new directory and increment the number for its folder value to match the primary key of the new analysis.

All analyses require the same core files:

banner.png ==> The main image banner seen on the analysis page.
cardCover.png ==> The image viewed on the analysis card on the Analytical Tasks page.
shortdesc.md ==> very short blurb for the card on the Analytical Tasks page, maximum of 100 characters.

dataset.md ==> dataset description for the dataset tab on the analysis page. 
description.md ==> overview for the analysis tab on the analysis page. 
SubmissionInstructions.md ==> Instructions on how to format your submission to be able to run in our system, on the instructions tab on the analysis page. 

You can add reference images used in your markdown files in this directory as well.

Use the format:
```
![image info](./random_time_shift.png)
```

The `./` is programmatically replaced with the actual path to your images in all build versions. 

When you are satisfied with your changes, copy all your files and paste them into the numbered directory you made earlier. That directory is now prepped for when the new analysis is added to our back-end.

Then, make a pull-request back to the main repository. When it is reviewed, approved and merged in, it will automatically deploy the updates to pv-validation-hub.org!

For updating an existing analysis, copy all of the files from the directory you wish to update into the development update. Follow the same steps as before to make any changes as needed and confirm it looks as desired, and then copy the files back.

There is also the `blurbs` directory, which contains the main md file for the blurb on the `/analyses` page. Customizing this file will adjust the blurb displayed on the main task selection page.

## Issues

TODO
