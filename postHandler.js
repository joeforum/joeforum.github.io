var faunadb = window.faunadb
  var q = faunadb.query
  var client = new faunadb.Client({
    secret: 'fnAEg9pdZHAAxikp9TsZwTKAQk6OFNDs2cXquXue',
    domain: 'db.eu.fauna.com',
    scheme: 'https',
  })

  function sleep(milisec) {
    return new Promise(resolve => {
    setTimeout(() => { resolve('') }, milisec);
    })
    }

let users = []

async function getAllUsers(){

    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users")), { size: 100000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
        for (let i = 0; i < x.data.length; i++) {
        users.push({id: x.data[i].data.id, username:  x.data[i].data.username, profile_image:  x.data[i].data.profile_image, admin: x.data[i].data.admin, account_created: x.data[i].data.account_created})
        }

    });

    console.log(users)
   

}

async function getPostStuff(){
  console.log("ok")
  if(localStorage.getItem("JoeForumUsername") == null)
  {
      document.getElementById("signupbutton").innerHTML = "<a style=\"color:white; text-decoration:none\" href=\"login.html\">Create an account or Log in</a>"
  }
  else{
    document.getElementById("signupbutton").innerHTML = "<a style=\"color:white; text-decoration:none\" href=\"me.html\">Edit your profile</a>"
  }
    getAllUsers()
    await sleep(500)
    getPostById()
}

async function getForumStuff(){
  if(localStorage.getItem("JoeForumUsername") == null)
  {
      document.getElementById("signupbutton").innerHTML = "<a style=\"color:white; text-decoration:none\" href=\"login.html\">Create an account or Log in</a>"
  }
  else{
    document.getElementById("signupbutton").innerHTML = "<a style=\"color:white; text-decoration:none\" href=\"me.html\">Edit your profile</a>"
  }

    getAllUsers()
    await sleep(500)
    getAllPosts()
}

  function getPostById(){

    let urlParams = new URLSearchParams(window.location.search);

    client.query(
        q.Get(
          q.Match(q.Index('post_by_id'), urlParams.get('id'))
        )
      )
      .then(function(ret) {
          console.log(users)
          
        let userinfo = users.findIndex(function(item, i) {
            return item.id === ret.data.uploader_id
          });
 
          console.log(users[userinfo])
          let adminbadge = ""
          if( users[userinfo].admin == true)
          {
              adminbadge = ` <label style="padding:2px; background-color:red; border-radius:5px; font-size:12px">ADMIN</label>`
          }


         
          var o = document.querySelector("link[rel~='icon']");
          o || ((o = document.createElement("link")).rel = "icon", document.getElementsByTagName("head")[0].appendChild(o)), o.href = users[userinfo].profile_image


            document.getElementById("commentcount").innerHTML = "Comments <b>[" + ret.data.comments.length + "]</b>"
            document.getElementById("title").innerHTML = "<b>" + ret.data.title + "</b>"
            document.title = "JoeForum || " + ret.data.title
            document.getElementById("content").innerHTML = ret.data.content.replace(/\n/g, "<br>")
            document.getElementById("uploaddate").innerHTML = "Posted on: " + ret.data.timestamp
            document.getElementById("username").innerHTML = "<b>" + users[userinfo].username + "</b>" + adminbadge
            document.getElementById("avatar").src = users[userinfo].profile_image
            document.getElementById("joindate").innerHTML = "Joined: " +  users[userinfo].account_created

            console.log(ret.data.comments)
            ret.data.comments.reverse()
            for (let i = 0; i < ret.data.comments.length; i++) {
                let userinfopos = users.findIndex(function(item, z) {
                    return item.id === ret.data.comments[i].user_id
                  });
                  console.log(users[userinfopos])

                  let commentadminbadge = ""
          if( users[userinfopos].admin == true)
          {
              commentadminbadge = ` <label style="padding:2px; background-color:red; border-radius:5px; font-size:10px">ADMIN</label>`
          }



                  document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + `          
                  <div class="wrapper">
                  <div class="left">
                  <label><b>` + users[userinfopos].username + "</b>" + commentadminbadge + `</label><br><br>
                  <img style="width:50%; border-radius:5px;" src="` + users[userinfopos].profile_image + `"><br><br>
                  <label style="float:left; background-color: #404040; width:100%; font-size:14px; padding-top:5px; padding-bottom:5px; border-radius:2px;"> Joined: ` + users[userinfopos].account_created + `</label><br>
                  </div>
                  <div class="right"> <label style="font-size: 15px;">` + ret.data.comments[i].content + `</label></div><br>
              </div>
              <div style="background-color: #424242; border-bottom-left-radius:5px; border-bottom-right-radius: 5px; padding-top: 4px; padding-bottom: 4px;">
              <label style="font-size: 12px;">Commented on: ` + ret.data.comments[i].timestamp + `</label>
           </div>   <br><br>        
                  `

            }

          
          
          
      })
      .catch(function(e){
         console.error(e)
      });


      if(localStorage.getItem("JoeForumUsername") == null)
      {
          document.getElementById("commentinput").innerHTML = "<p>You must be logged in to comment.</p>"
      }
      else{

        document.getElementById("leavecomment").innerHTML = "Leave a comment as <b>" + localStorage.getItem("JoeForumUsername") + "</b>"
      }




  }


  function getAllPosts(){

    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("posts")), { size: 100000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
        x.data.reverse()
        for (let i = 0; i < x.data.length; i++) {


            let userinfopos = users.findIndex(function(item, z) {
                return item.id === x.data[i].data.uploader_id
              });
              console.log(userinfopos)

              let commentadminbadge = ""
      if( users[userinfopos].admin == true)
      {
          commentadminbadge = ` <label style="padding:2px; background-color:red; border-radius:5px; font-size:10px;">ADMIN</label>`
      }



    document.getElementById("posts").innerHTML =   document.getElementById("posts").innerHTML + `<div class="body">
<div class="wrapper2">
<div class="left2">
	<label id="username"><b>` + users[userinfopos].username + commentadminbadge + `</b></label><br><br>
        <img id="avatar" style="width:50%; border-radius:5px;" src="` + users[userinfopos].profile_image + `"><br><br>
</div>
<div class="right2">
	<h3><a style="color:white" href="post.html?id=` +  x.data[i].data.id + `">` + x.data[i].data.title + `</a></h3>
	<p>` + x.data[i].data.content.substring(0, 50) + "..." + `</p>
</div>
</div>
<div style="background-color: #424242; border-bottom-left-radius:5px; border-bottom-right-radius: 5px; padding-top: 4px; padding-bottom: 4px;">
	<label style="font-size: 12px;">Posted on: ` + x.data[i].data.timestamp + `<br><i class="fas fa-comment-alt"></i> ` + x.data[i].data.comments.length + `</label>
 </div> 
</div><br><br>`



        }
        

    });


  }


  function makeAccount(){

    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), document.getElementById("username").value)
        )
      )
      .then(function(ret){ 
           
      alert("This name is taken!")
      
      })
        
      .catch(function(e){
      
      let randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
      
        let date = new Date();
          client.query(
        q.Create(
          q.Collection('users'),
          { data: { username: document.getElementById("username").value.replace(/\s/g, "-"), profile_image: "https://dummyimage.com/1000/" + randomColor + "/141414&text=" + document.getElementById("username").value.charAt(0), password: document.getElementById("password").value, admin: false, id: parseInt(generateId(5)), account_created: date.toUTCString()} },
        )
      )
      .then(function(ret){
      
          localStorage.setItem('JoeForumUsername', ret.data.username);
          localStorage.setItem('JoeForumID', parseInt(ret.data.id));
          window.location.href = "me.html"
          })
      
      });


  }


  function generateId(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


function logIn(){

    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), document.getElementById("username").value)
        )
      )
            
      .then(function(ret) {
                            
        if(ret.data.password != document.getElementById("password").value)  
        {
          alert("User and password do not match!")
        }
        else{
         
          localStorage.setItem('JoeForumUsername', ret.data.username);
          localStorage.setItem('JoeForumID', parseInt(ret.data.id));
          window.location.href = "me.html"
          
        }
      })
      .catch(function(e){
        alert("User not found.")
      });

}


function checkIfLoggedIn(){
    if(localStorage.getItem("JoeForumUsername") != null)
    {
        window.location.href = "me.html"
    }

}

function post(){

    let date = new Date();
    client.query(
        q.Create(
          q.Collection('posts'),
          { data: {id: generateId(7), title: document.getElementById("title").value, content: document.getElementById("content").value, uploader_id: parseInt(localStorage.getItem("JoeForumID")), timestamp: date.toUTCString(), comments:[]} },
        )
      )
      .then(function(ret){
      
           alert("Success! Your forum post link is " + window.location.href.replace(window.location.href.split("/")[ window.location.href.split("/").length - 1], "post.html") + "?id=" + ret.data.id)
          })
      
      
}

function logOut(){
    localStorage.removeItem('JoeForumUsername');
    localStorage.removeItem('JoeForumID');
    window.location.href = "login.html"

}

function postComment(){

    let urlParams = new URLSearchParams(window.location.search);
    if( document.getElementById("commentText").value == "")
    {
        alert("Please fill out all fields before posting a comment.")
    }
    else
    {
client.query(
q.Get(
q.Match(q.Index('post_by_id'), urlParams.get('id'))
)
)
.then(function(ret){ 

let newTime = new Date();
let comments = ret.data.comments
comments.push({timestamp: newTime.toUTCString(), content: document.getElementById("commentText").value, user_id: parseInt(localStorage.getItem("JoeForumID"))})
client.query(
q.Update(q.Ref(q.Collection("posts"), ret.ref.value.id), {
data: {
  comments: comments
},
})
);

alert("Message posted!")
window.location.reload();
})

.catch(function(e){


console.log(e)

});

    }
    
}

function getUserInfo(){


  client.query(
    q.Get(
      q.Match(q.Index('users_by_id'), parseInt(localStorage.getItem("JoeForumID")))
    )
  )
  .then(function(ret){ 
       
    document.getElementById("username").value = ret.data.username
    document.getElementById("password").value = ret.data.password
    document.getElementById("pfp").value = ret.data.profile_image
  
  })
    
  .catch(function(e){
  
  window.location.href = "index.html"
  
  });



}

function saveData(){



    client.query(
      q.Get(
        q.Match(q.Index('users_by_id'), parseInt(localStorage.getItem("JoeForumID")))
      )
    )
    .then(function(ret){ 
         
      client.query(
        q.Update(q.Ref(q.Collection("users"), ret.ref.value.id), {
        data: {
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
          profile_image: document.getElementById("pfp").value


        },
        })
        );
        alert("Saved!")
    
    })
      
    .catch(function(e){
    
    
    
    });

}
    