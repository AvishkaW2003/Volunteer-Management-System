import Notification
from "../models/notificationModel.js";




// Admin send

export const sendNotification =
async (
req,
res
)=>{

try{

const notification =
await Notification
.create(
req.body
);

res
.status(201)
.json({

message:
"Notification sent",

notification,

});

}

catch(error){

res
.status(500)
.json({

message:
error.message

});

}

};




// Admin view

export const getNotifications =
async (
req,
res
)=>{

try{

const list =
await Notification
.findAll({

order:[
[
"createdAt",
"DESC"
]
]

});

res
.status(200)
.json(
list
);

}

catch(error){

res
.status(500)
.json({

message:
error.message

});

}

};




// User view

export const myNotifications =
async (
req,
res
)=>{

try{

const list =
await Notification
.findAll({

where:{

role:
req.user.role

},

order:[
[
"createdAt",
"DESC"
]
]

});

res
.status(200)
.json(
list
);

}

catch(error){

res
.status(500)
.json({

message:
error.message

});

}

};




// Mark read

export const markRead =
async (
req,
res
)=>{

try{

const notification =
await Notification
.findByPk(
req.params.id
);

if(
!notification
){

return res
.status(404)
.json({

message:
"Notification not found"

});

}


await notification
.update({

isRead:
true

});


res
.status(200)
.json({

message:
"Marked as read"

});

}

catch(error){

res
.status(500)
.json({

message:
error.message

});

}

};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notification.destroy();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
