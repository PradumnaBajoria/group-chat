import React, {useState, useRef} from "react"
import './App.css';
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

import {useAuthState} from "react-firebase-hooks/auth"
import {useCollectionData} from "react-firebase-hooks/firestore"

firebase.initializeApp({
  apiKey: "AIzaSyA3kZDkdVcPnqY-uIC72ONbfmuboH4xA-4",
  authDomain: "group-chat-react.firebaseapp.com",
  projectId: "group-chat-react",
  storageBucket: "group-chat-react.appspot.com",
  messagingSenderId: "858814768089",
  appId: "1:858814768089:web:2a921317c9ec43242f6fc8",
  measurementId: "G-M2JP1BRWES"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header className="App-header">
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return(
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>SignOut</button>
  )
}

function ChatRoom() {

  const scroll = useRef()
  const messageRef = firestore.collection("messages")
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')
  
  const sendMessage = async(e) => {
    e.preventDefault()
    const {uid, photoURL} = auth.currentUser;
    console.log("hello",photoURL)
    console.log("hello",uid)
    await messageRef.add({
      text : formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    //console.log("hi", photoURL)
    //console.log("hi", uid)
    setFormValue('')
    scroll.current.scrollIntoView({behaviour: "smooth"})

  }

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={scroll}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <div>

      </div>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved"

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
