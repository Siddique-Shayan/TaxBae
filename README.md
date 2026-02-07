### How to start a Project:-

## First Open , Two different terminal , one for client and one for backend.

# For client:- 

``` 
npm fix --force
```

```
npm install
```

Create .env file and add
```
    VITE_API_URL=http://localhost:8000/api
```
.env strictly inside client folder , not somewhere else


```
npm run dev
```

# For server :- 

```
npm install
```

Create .env file inside backend folder and add.
```
    NODE_ENV=development
    PORT=8000
    BASE_PATH=/api

    JWT_SECRET=TaxBae
    JWT_EXPIRES_IN=45m

    JWT_REFRESH_SECRET=OPTaxbae
    JWT_REFRESH_EXPIRES_IN=7d

    MONGO_URI=YOUR_MONGO_URL
    GEMINI_API_KEY=YOUR_GEMINI_KEY


    CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUD_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUD_API_SECRET


    RESEND_API_KEY=YOUR_RESEND_API_KEY
    RESEND_MAILER_SENDER=YOUR_EMAIL_ID


    FRONTEND_ORIGIN=http://localhost:5173
```
.env strictly inside client folder , not somewhere else


```
npm run dev
```


