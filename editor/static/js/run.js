// // finding an instance
var ed = ace.edit("editor");
var ed2 = ace.edit("stdin_area");

var x = window.matchMedia("(max-width: 1000px)")


var output = document.querySelector(".output");

var language = ""
var lang = ""

function change_language(event) {
    console.log(event.target.value)

    var e = document.querySelector(".language");
    lang = e.options[e.selectedIndex].text; // get selected option text

    language = event.target.value;
    // lang = event.target.value;
    if (language == "c") {
        ed.getSession().setMode("ace/mode/c_cpp");
        $(".filename1").html("code.c");
    } else if (language == "cpp") {
        ed.getSession().setMode("ace/mode/c_cpp");
        $(".filename1").html("code.cpp");
    } else if (language == "python3") {
        ed.getSession().setMode("ace/mode/python");
        $(".filename1").html("code.py");

    } else if (language == "openJDK-8") {
        ed.getSession().setMode("ace/mode/java");
        $(".filename1").html("code.java");

    } else if (language == "javascript") {
        ed.getSession().setMode("ace/mode/javascript");
        $(".filename1").html("code.js");
    }
}

// console.log(language)

document.querySelector(".run_button").addEventListener("click", (e) => {
    console.log("run button is clicked");

    // for media query
    if (x.matches) {
        filename1.style.cssText = "background-color: black; border-left:none ;border-right: none;border-top:none;z-index:9";
        filename2.style.cssText = "background-color: black; border-left:none ;border-right: none;border-top:none;z-index:9";
        filename3.style.cssText = "background-color:var(--dracula); border-left:1px solid var(--border-color) ;border-right: 1px solid var(--border-color);border-top:1px solid var(--border-color);z-index:10";
        editor.style.zIndex = "8";
        stdin_area.style.zIndex = "8";
        stdout_area.style.zIndex = "9";

    }

    $(".loader").show();
    $(".status").show();
    $(".status").css("background-color", "rgb(139, 139, 139)")
    $(".success").html("");
    $(".right_bottombar").html("");

    output.innerHTML = "";


    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    $(".time").html(dateTime);
    $(".language_info").html(lang);


    // console.log(dateTime);

    let code = ed.getValue();
    let input = ed2.getValue();

    // console.log(stdin);

    var data = {
        src: `${code}`,
        stdin: `${input}`,
        lang: `${language}`,
        timeout: "5"
    }

    console.log(data)

    // var myJson = JSON.stringify(data)
    // console.log(myJson)

    // "http://localhost:8080/submit"


    let server_link = "http://localhost:9090/submit" ;
    // let server_link = "http://localhost:8080/submit" ;
    // let server_link = "http://52.172.231.206:8080/submit";
    // let server_link = "https://52.172.231.206:8080/submit";

    // const https = require('https');
    // const httpsAgent = new https.Agent({
    //     rejectUnauthorized:false
    // })

    fetch(server_link, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        // agent:httpsAgent,
        body: JSON.stringify(data)
    }).then(res => {
        console.log(res)
        return res.text()
    }).then(data => {
        // console.log(data)
        output_link(data)
    }).catch(function () {
        console.log("error while connecting api server");

        $(".success").html("Offline");
        $(".loader").hide();

        $(".status").css("background-color", "rgb(235, 75, 75)");



    });


})

// when the link is available
function output_link(data_link) {
    console.log(data_link)


    // let myvar = setInterval(function checklink() {
    fetch(data_link)
        .then(res => {
            console.log(res);
            return res.json();
        })
        .then(data => {

            console.log(data.status);
            if (data.status == "Successful") {
                console.log(data);

                output.innerHTML = data.output;
                $(".success").html(data.status);
                $(".loader").hide(); //hide the loader
                $(".status").css("background-color", "rgb(119, 199, 0)"); //make the background green
                $(".right_bottombar").html(data.time + " sec");

            } else if (data.status == "Failed" || data.status == "Invalid Request") {
                console.log(data)

                output.innerHTML = data.output;
                $(".success").html(data.status);
                $(".loader").hide(); //hide the loader
                $(".status").css("background-color", "rgb(235, 75, 75)"); //make the background red

            } else if (data.status == "Queued") {
                $(".success").html(data.status);
                $(".status").css("background-color", "rgb(139, 139, 139)"); //make the background grey
                output_link(data_link) //recursive call

            } else if (data.status == "Processing") {
                $(".success").html(data.status);
                $(".status").css("background-color", "rgb(139, 139, 139)"); //make the background grey
                output_link(data_link) //recursive call

            } else if (data.status == "Runtime Error") {
                output.innerHTML = "Out of Memory";
                $(".success").html(data.status);
                $(".loader").hide(); //hide the loader
                $(".status").css("background-color", "rgb(235, 75, 75)"); //make the background red

            } else {
                output.innerHTML = "Something went wrong";
                $(".success").html("Failed");
                $(".loader").hide(); //hide the loader
                $(".status").css("background-color", "rgb(235, 75, 75)"); //make the background red
            }
        })

}


// // when the link is available
// function output_link(data_link) {
//     console.log(data_link)


//     let myvar = setInterval(function checklink() {
//         fetch(data_link)
//             .then(res => {
//                 console.log(res);
//                 return res.json();
//             })
//             .then(data => {

//                 console.log(data.status);



//                 if(data.status == "Successful"){
//                     console.log(data);
//                     clearInterval(myvar);
//                     output.innerHTML = data.output;
//                     $(".success").html(data.status);
//                     $(".loader").hide();//hide the loader
//                     $(".status").css("background-color", "rgb(119, 199, 0)");//make the background green
//                 }else if(data.status == "Failed" || data.status == "Invalid Request"){
//                     console.log(data)
//                     clearInterval(myvar);
//                     output.innerHTML = data.output;
//                     $(".success").html(data.status);
//                     $(".loader").hide();//hide the loader
//                     $(".status").css("background-color", "rgb(235, 75, 75)");//make the background red
//                 }else if(data.status == "Queued"){
//                     $(".success").html(data.status);
//                     $(".status").css("background-color", "rgb(139, 139, 139)");//make the background grey
//                 }else if(data.status == "Processing"){
//                     $(".success").html(data.status);
//                     $(".status").css("background-color", "rgb(139, 139, 139)");//make the background grey
//                 }else if(data.status == "Runtime Error"){
//                     clearInterval(myvar);
//                     output.innerHTML = "Out of Memory";
//                     $(".success").html(data.status);
//                     $(".loader").hide();//hide the loader
//                     $(".status").css("background-color", "rgb(235, 75, 75)");//make the background red
//                 }else {
//                     clearInterval(myvar);
//                     output.innerHTML = "Something went wrong";
//                     $(".success").html("Failed");
//                     $(".loader").hide();//hide the loader
//                     $(".status").css("background-color", "rgb(235, 75, 75)");//make the background red
//                 }


//                 // if (data.output) {
//                 //     console.log(data);
//                 //     clearInterval(myvar);
//                 //     output.innerHTML = data.output;
//                 //     $(".success").html(data.status);
//                 //     $(".loader").hide();
//                 //     if (data.status == "Successful")
//                 //         $(".status").css("background-color", "rgb(119, 199, 0)");
//                 //     else
//                 //         $(".status").css("background-color", "rgb(235, 75, 75)");

//                 // } else if (data.status) {
//                 //     // console.log(data);
//                 //     // output.innerHTML = data.status;
//                 //     $(".success").html(data.status);
//                 // } else {
//                 //     clearInterval(myvar);
//                 //     output.innerHTML = "Something went wrong";
//                 // }

//             })
//     }, 500)
// }