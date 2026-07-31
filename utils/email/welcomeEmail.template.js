
const welcomeTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
<style>
body{
    margin:0;
    padding:0;
    background:#f4f4f4;
    font-family:Arial,Helvetica,sans-serif;
}
.container{
    max-width:600px;
    margin:40px auto;
    background:#fff;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,.1);
}
.header{
    background:#2563eb;
    color:#fff;
    text-align:center;
    padding:30px;
}
.content{
    padding:30px;
    color:#333;
    line-height:1.7;
}
.button{
    display:inline-block;
    margin-top:20px;
    padding:12px 24px;
    background:#2563eb;
    color:#fff !important;
    text-decoration:none;
    border-radius:6px;
}
.footer{
    padding:20px;
    text-align:center;
    color:#777;
    font-size:13px;
}
</style>
</head>

<body>

<div class="container">

<div class="header">
<h1>🎉 Welcome!</h1>
</div>

<div class="content">

<h2>Hello ${name},</h2>

<p>
We're excited to have you onboard.
Thank you for creating your account.
</p>

<p>
You can now enjoy all the features of our platform.
</p>

<a class="button" href="#">Get Started</a>

</div>

<div class="footer">
© 2026 Notification System
</div>

</div>

</body>
</html>
`;

export default welcomeTemplate;