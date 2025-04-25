# purpose

to make cooperation and organization of the employees and employers more easier and stronger

# features

-login-system
employees will be able to sign-up in the system and create accounts for themselves
employees will be able to sign-in in the system and access whatever resource they can with tokens

-profile
employees and employers will be able to see and change their profile informations

-messages
employees and employers will be able to message each other

-events
employers will be able to create events and employees will be able to see them on calendar

-notes
employees and employers will be able to create notes and others will be able to see them

-deparments
employers will be able to add and see deparments

-employees
employers will be able to see employees and assign them to departments

# tech stack

-frontend
React,NextJS,Typescript,Fontawesome...
-backend
mongodb,jwt,vercel

# schemas

user: name,lastName,phone,email,password,city,occupation,departmentName,date
message: from,to,title,content,date
event: title,content,date
note: title,content,date,from
department: name,employees,chief,date

# folder structure

-frontend
/giris
/kayit-ol
/hesabim
/mesajlarim
/mesaj-gonder
/takvim
/event-olustur (admin)
/notlar
/not-olustur
/departmanlar (admin)
/calisanlar (admin)

-backend
/api/login
post -> return token from body.json()

/api/users
get(jwt) -> return user information
post -> create user with body.json()
put(jwt) -> update user with body.json()
delete(jwt,admin) -> remove user with body.json()
/all(jwt,admin) -> return all user documents

/api/messages
get(jwt) -> return sent and recvied messages
post(jwt) -> send message with body.json()

/api/event
get(jwt) -> return events
post(jwt,admin) -> create event with body.json()

/api/notes
get(jwt) -> return notes
post(jwt) -> create note with body.json()

/api/departments
get(jwt,admin) -> return departments
post(jwt,admin) -> create department with body.json()
