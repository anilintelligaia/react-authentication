const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
module.exports = app => {
  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: "Error: First name cannot be blank "
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: "Error: Last name cannot be blank "
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "Error: email name cannot be blank "
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: password name cannot be blank "
      });
    }

    email = email.toLowerCase();
    // 1 verify email doesn't exist
    // 2 save

    User.find(
      {
        email: email
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server Error "
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: "Error: User Already Exist"
          });
        }
      }
    );
    // Save the new user
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = newUser.generateHash(password);

    newUser.save((err, user) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server ERROR"
        });
      }

      return res.send({
        success: true,
        message: "Signed Up"
      });
    });
  });

// for signin

  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: "Error: email name cannot be blank "
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: password name cannot be blank "
      });
    }

    email = email.toLowerCase();

    User.find(
      {
        email: email
      },
      (err, users) => {
        console.log(err)
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server Error"
          });
        }

        if (users.length != 1) {
          return res.send({
            success: false,
            message: "Error: Invalid"
          });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: "Error: Invalid"
          });
        }

        // otherwise valid user
        const userSession = new UserSession();
        userSession.userId = user._id;

        userSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: Server Error"
            });
          }

          return res.send({
            success: true,
            message: "valid signin",
            token: doc._id
          });
        });
      }
    );
  });

// verify user

  app.get("/api/account/verify", (req, res, next) => {

    // verify Token
    const { query}= req;
    const {token}=query;

   // verify the token is one of kind and it's is not deleted
   UserSession.find({
     _id: token,
     isDeleted: false
   },(err,sessions)=>{
     if(err){
       return res.send({
         success: false,
         message: 'Error: Serve Error'

       })
     }

     if(sessions.length !=1){
      return res.send({
        success: false,
        message: 'Error: Invalid'

      })
     } else{
      return res.send({
        success: true,
        message: 'Error: Good'

      })
     }
   })

  });
  app.get("/api/account/logout",(req,res,next)=>{
    

    // verify Token
    const { query}= req;
    const {token}=query;

   // verify the token is one of kind and it's is not deleted
   UserSession.findOneAndUpdate({
     _id: token,
     isDeleted: false
   },{$set:{isDeleted:true}},null,(err,sessions)=>{
     if(err){
       return res.send({
         success: false,
         message: 'Error: Serve Error'

       });
     }
    else{
      return res.send({
        success: true,
        message: ' Good'
      });
     }
   })
    

  });
};
