This is explanation for all files and their uses

1 Controller

i. comment controller to control all comment storing and accessing
ii. followUnfollow to follow and unfollow users
iii. getTotal is to see MOSTFOLLOWED USER, MOSTLIKED PRODUCT, MOSTDISLIKED PRODUCT
iv. like controller to add and delete like and dislikes both

2 Middlewares

i. appError is to initialize errors during code
ii. authMiddleware is to validate details filled by user to register himself
iii. commonMiddleware is to validate only email and password for many routes
iv. globalErrorHandler is u know xD
v. nodemail to send mail (resetPassword)
vi. productAuth is to validate all neccessary details filled by user
vii. validateToken is for authorization in every request