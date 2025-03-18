// linked constant to dom;
let ss;
let micEnabled=true;
let systemAudioEnabled=true;
let mediaRecorder;
let recordedChunks=[];

const micBtn=document.getElementById('micBtn');
const systemBtn=document.getElementById('systemBtn');
const startBtn=document.getElementById('startBtn');
const stopBtn=document.getElementById('stopBtn');
const preview=document.getElementById('stream-source');
const downloadLink=document.getElementById('downloadLink');
// const handleMicBtn=()=>{
//     console.log('handleMicBtn');
// }

// const handleSystemBtn=()=>{
//     console.log('handleSystemBtn');
// }


const handleStopBtn=()=>{


    console.log('handleStopBtn');

    const blob=new Blob(recordedChunks,{
        type:"video/webm"
    });
    console.log('chunks'+recordedChunks.length)
    const url=URL.createObjectURL(blob);
    downloadLink.href=url;
    downloadLink.download="ScreenRecording.webm";
    downloadLink.classList.remove("hidden");
    recordedChunks=[];
    startBtn.setAttribute('disabled',false);
    stopBtn.setAttribute('disabled',true);
    startBtn.disabled=false;
    stopBtn.disabled=true;
    startBtn.classList.toggle('disable');
    stopBtn.classList.toggle('disable');
    mediaRecorder.stop();
    ss.getTracks().forEach(track => {
        track.stop()
    });
    preview.srcObject=null;
}


const handleStartBtn=()=>{
    console.log('handleStartBtn');

    // get screen stream
        
    // get microphone stream if enabled

    // combine streams if mic is enabled

    // initialize mediaRecorder
    startBtn.disabled=true;
    stopBtn.disabled=false;
    startBtn.classList.toggle('disable');
    stopBtn.classList.toggle('disable');

    let promise=new Promise(
        (resolve,reject)=>{
        navigator.mediaDevices.getDisplayMedia({
            video:{
                frameRate:30
            },
            audio:systemAudioEnabled
        })
        .then((screenStream)=>{
            if(micEnabled){

                navigator.mediaDevices.getUserMedia({
                    audio:true
                }).then(micStream=>{
                    resolve({screenStream,micStream});
                }).catch(error=>{
                    reject(error);
                })
            }
            else{
                resolve({screenStream,micStream:null});
            }
        })
        .catch(error=>reject(error));
    })

    promise
    .then(({screenStream,micStream})=>{
        ss=screenStream;
        let finalStream=micEnabled?new MediaStream(
            [...screenStream.getTracks(),...micStream.getTracks()]
        ):screenStream;
        preview.srcObject=finalStream;
        preview.play();
        mediaRecorder=new MediaRecorder(
            finalStream,{
                mimeType:"video/webm"
            }
        );

        mediaRecorder.ondataavailable=(event)=>{
            if(event.data.size>0){
                recordedChunks.push(event.data);
            }
            console.log(recordedChunks);
        }
        mediaRecorder.start();
        mediaRecorder.onstop=()=>{
            // const blob=new Blob(recordedChunks,{
            //     type:"video/webm"
            // });
            // recordedChunks=[];
    
            // const url=URL.createObjectURL(blob);
            // downloadLink.href=url;
            // downloadLink.dowload="ScreenRecording.webm";
            // downloadList.classList.remove("hidden");
            handleStopBtn();
        };

    })
    .catch(error=>console.error(error));
    // 
}

// added click listeners;

startBtn.addEventListener('click',handleStartBtn);
stopBtn.addEventListener('click',handleStopBtn);
// micBtn.addEventListener('click',handleMicBtn);
// systemBtn.addEventListener('click',handleSystemBtn);



// streming options handler

micBtn.addEventListener('click',()=>{
    micEnabled=!micEnabled;
    document.getElementById('micIcon').className=micEnabled?"fa-solid fa-microphone text-green-400":"fa-solid fa-microphone-slash text-red-400";
});


systemBtn.addEventListener('click',()=>{
    systemAudioEnabled=!systemAudioEnabled;
    document.getElementById('systemIcon').className=systemAudioEnabled?"fa-solid fa-volume-high text-green-400" : "fa-solid fa-volume-xmark text-red-400";
})

const Loading=()=>{
    stopBtn.disabled=true;
    stopBtn.classList.add('disable');
}

window.onload=Loading();

