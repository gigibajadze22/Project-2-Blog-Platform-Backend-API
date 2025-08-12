# Blog Platform Backend API

## About the Project

Backend API for the Blog Platform, which allows users to register, create posts, edit, delete, view them, and add comments. The system provides role-based authorization (User and Admin) and secure resource management.

## Key Features

- User registration and login with JWT  
- Role-based access control (User, Admin)  
- CRUD operations for posts and comments  
- Password hashing with bcrypt  
- Uploading profile and post images with Multer  
- Password recovery via email using Nodemailer  
- Standardized error handling  
- API documentation in Swagger UI  
- Protected API endpoints with authorization  
- Ready for online deployment (Heroku and others)  

## Technologies Used

- Node.js, Express.js  
- PostgreSQL (Prisma ORM)  
- JWT, bcrypt  
- Multer, Nodemailer  
- Swagger (API documentation)  
- Postman (API testing)  

## API Endpoints Overview

> Full and detailed API documentation is available at `/api-docs` (Swagger UI).

Main operations:

- User registration and login  
- View and update own profile  
- Create, edit, delete, and view posts  
- Manage comments  

## How to Run

1. Clone the repository  
2. Install required packages: `npm install`  
3. Configure environment variables (.env) (database, JWT, email settings)  
4. Run Prisma migrations  
5. Start the server: `npm run dev`  
6. View the API documentation: `/api-docs` (Swagger UI)  

## Deployment

The project is ready for deployment to Heroku or other online platforms.

---

Created by Gigi Bajadze 

---------------------------------------------------------

# Blog Platform Backend API

## პროექტის შესახებ

Blog Platform-ის Backend API, რომელიც საშუალებას აძლევს მომხმარებლებს რეგისტრაციას, პოსტების შექმნას, რედაქტირებას, წაშლას, ნახვას და კომენტარების დამატებას. სისტემა უზრუნველყოფს როლის დაფუძნებულ ავტორიზაციას (User და Admin) და უსაფრთხო რესურსების მართვას.

## ძირითადი ფუნქციები

- მომხმარებლის რეგისტრაცია და ლოგინი JWT-ით  
- როლის მიხედვით დაშვებები (User, Admin)  
- პოსტებისა და კომენტარების CRUD ოპერაციები  
- პაროლის დაშიფრვა bcrypt-ით  
- პროფილისა და პოსტის სურათების ატვირთვა Multer-ით  
- პაროლის აღდგენა ელფოსტით Nodemailer-ის დახმარებით  
- შეცდომების სტანდარტული დამუშავება  
- API დოკუმენტაცია Swagger UI-ში  
- დაცული API endpoint-ები ავტორიზაციით  
- მზადია ონლაინ განთავსებისთვის (Heroku და სხვა)  

## გამოყენებული ტექნოლოგიები

- Node.js, Express.js  
- PostgreSQL (Prisma ORM)  
- JWT, bcrypt  
- Multer, Nodemailer  
- Swagger (API დოკუმენტაცია)  
- Postman (API ტესტირება)  

## API Endpoint-ების მიმოხილვა

> სრული და დეტალური API დოკუმენტაცია ხელმისაწვდომია `/api-docs` (Swagger UI).

მთავარი ოპერაციები:

- მომხმარებლის რეგისტრაცია და ლოგინი  
- საკუთარი პროფილის ნახვა და განახლება  
- პოსტების შექმნა, რედაქტირება, წაშლა, ნახვა  
- კომენტარების მართვა  

## როგორ გავუშვა

1. რეპოზიტორიის კლონირება  
2. საჭირო პაკეტების ინსტალაცია: `npm install`  
3. გარემოს ცვლადების (.env) კონფიგურაცია (ბაზის, JWT, ელფოსტის პარამეტრები)  
4. Prisma მიგრაციების შესრულება  
5. სერვერის გაშვება: `npm run dev`  
6. API დოკუმენტაციის ნახვა: `/api-docs` (Swagger UI)  

## განთავსება

პროექტი მზადაა განთავსებისთვის Heroku ან სხვა ონლაინ პლატფორმებზე.

---

შექმნილია გიგი ბაჯაძის მიერ 
