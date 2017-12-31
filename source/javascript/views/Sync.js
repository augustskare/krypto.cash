import {h, Component} from 'preact';
import firebase from '@firebase/app';
import '@firebase/database';
import firebaseConfig from '../../../firebase-config';

import Button from '../components/button';
import {Input} from '../components/inputs';
import store from '../utils/store';

if (firebase.apps.length < 1) {
  firebase.initializeApp(firebaseConfig);
}

class Sync extends Component {
  constructor() {
    super();

    this.database = firebase.database();

    this.handleNewConnection = this.handleNewConnection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onIcecandidate = this.onIcecandidate.bind(this);
    this.onDatabaseChange = this.onDatabaseChange.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleSync = this.handleSync.bind(this); 

    this.peerConnection = new RTCPeerConnection();
    this.peerConnection.addEventListener('icecandidate', this.onIcecandidate);
  }

  onIcecandidate(event) {
    if (!event.candidate) { return }

    this.dbRef.child('ice').update({
      candidate: event.candidate,
      offerConnection: this.offerConnection,
    });
  }

  onDatabaseChange(snapshot) {
    const data = snapshot.val() || {};

    if (data.sdp) {
      if (!(this.peerConnection.localDescription || {}).type && data.sdp.type === 'offer') {
        this.peerConnection.setRemoteDescription(data.sdp)
          .then(() => this.peerConnection.createAnswer())
          .then(answer => this.peerConnection.setLocalDescription(answer))
          .then(() => this.dbRef.update({
            sdp: this.peerConnection.localDescription.toJSON(),
          }));
      }

      if (!(this.peerConnection.remoteDescription || {}).type && data.sdp.type === 'answer') {
        this.peerConnection.setRemoteDescription(data.sdp);
      }
    }
    
    if (data.ice && data.ice.offerConnection !== this.offerConnection) {
      this.peerConnection.addIceCandidate(data.ice.candidate);
    }
  }

  handleNewConnection() {
    this.offerConnection = true;
    const connectionID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toLowerCase();
    this.dbRef = firebase.database().ref(`sync/${connectionID}`);
    this.dbRef.on('value', this.onDatabaseChange);

    this.connectionChannel = this.peerConnection.createDataChannel('dataChannel');
    this.connectionChannel.addEventListener('open', event => {
      this.setState({ connected: true });
    });
    this.connectionChannel.addEventListener('message', event => {
      if (event.data === 'sync-done') {
        this.setState({ syncComplete: true });
      }
    });

    this.peerConnection.createOffer().then(offer => this.peerConnection.setLocalDescription(offer))
      .then(() => {
        this.dbRef.set({ sdp: this.peerConnection.localDescription.toJSON() });

        this.setState({ connectionID, connected: false, connectionType: 'offer' });  
      });
  }

  handleSync() {
    this.connectionChannel.send(JSON.stringify(this.props.wallet));
  }

  handleConnect() {
    this.setState({ 
      connectionType: 'answer',
     }); 
  }

  handleSubmit(event) {
    event.preventDefault();
    this.offerConnection = false;

    const id = event.target.querySelector('input[type="text"]').value.toLowerCase();
    this.dbRef = firebase.database().ref(`sync/${id}`);
    this.dbRef.on('value', this.onDatabaseChange);

    this.setState({ connected: false })

    this.peerConnection.addEventListener('datachannel', ({channel}) => {
      channel.onmessage = event => {
        const data = JSON.parse(event.data);
        store.add(data);
        this.setState({
          newItems: data,
        })
        channel.send('sync-done');
      }
      channel.onopen = event => this.setState({ connected: true });
    });
  }

  render(props, state) {
    return (
      <div class="content">
        <div class="heading">
          <h2>Data sync</h2>
        </div>

        { state.connectionType === undefined && (
          <div>
            <p>Data sync lets you sync data between devices. Set up a new connection on the device you want to transfer from, and use the connection code on your second device to establish a connection.</p>
            
            <div class="button-group grid">
              <Button onClick={this.handleNewConnection}>New connection</Button>
              <span class="small">or</span>
              <Button onClick={this.handleConnect}>Connect</Button>
            </div>

            <p>Your data is synced over a peer to peer connection, and never stored on any server.</p>
          </div>
        ) }

        { state.connectionType === 'offer' && (
          <div>
            <dl class="temp">
              <div>
              <dt>Connection code</dt>
              <dd class="code">{state.connectionID}</dd>
              </div>
              <div>
              <dt>Connection status</dt>
              <dd>{ state.connected ? 'Connected' : 'Waiting' }</dd>
              </div>
            </dl>
            { state.connected && !state.syncComplete && (
              <Button onClick={this.handleSync}>Sync {props.wallet.length} {props.wallet.length > 1 ? 'items' : 'item' }</Button>
            )}
            { state.syncComplete && <p>{props.wallet.length} {props.wallet.length > 1 ? 'items' : 'item' } synced</p>}
          </div>
        ) }

        { state.connectionType === 'answer' && (
          <div>

            { state.connected === undefined ? (
              <form onSubmit={this.handleSubmit}>
                <Input label="Connection ID" id="connecttionID" type="text" required />
                <Button type="submit">Connect</Button>
              </form>
            ) : (
              <div>
                { state.newItems !== undefined ? (
                  <p>{state.newItems.length} {state.newItems.length > 1 ? 'items' : 'item' } synced</p>
                ) : (
                  <p>{state.connected ? 'Connected' : 'Loading' }</p>
                ) }

              </div>
            ) }
          </div>
        ) }

      </div>
    )
  }
}

export default Sync;