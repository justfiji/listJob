import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import GreetPage from './GreetPage';
import PostingDisplay from './PostingDisplay';
import PopupWindow from './PopupWindow';

class App extends Component {
 // <div dangerouslySetInnerHTML={{ __html: post.description }}/>

  constructor(props){

    super(props);
    this.state = {
    posts: [],
    pageNumber: 1,
    togglePopup: false,
    saveToggle: false,
    savedPost: []
  }
    this.addMore = this.addMore.bind(this);
    this.resetListing = this.resetListing.bind(this);
    this.jobClick = this.jobClick.bind(this);
    this.savePost = this.savePost.bind(this);
    this.displaySaved = this.displaySaved.bind(this);
  }
  
  /*
   Func Name: addMore
   Purpose: Retrieve all the job listings with no filter from the API
   */
   addMore(){
    if(this.state.saveToggle === true){
      this.displaySaved();
    }

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = proxyurl + "//jobs.github.com/positions.json?page="+this.state.pageNumber+"&utf8=%E2%9C%93&description=&location=";
    axios.get(url, {onDownloadProgress: function(){
    }}) 
      .then(res => {
        this.setState(
          {
            posts : [...this.state.posts,...res.data],
            pageNumber : this.state.pageNumber + 1,
            togglePopup : false,
            popWindowInfo: null
          }
        )
      })  
   }

   jobClick(card){
    this.setState({
      togglePopup: !this.state.togglePopup,
      popWindowInfo: card 

    })
   }

   savePost(post){

     console.log("saved the post");
     console.log(post);
     this.setState({
       savedPost: [...this.state.savedPost, post]
     })
     console.log("the post is saved, array below");
     console.log(this.state.savedPost);

   }

   displaySaved(){
     this.setState(
       {
         saveToggle: !this.state.saveToggle
       }
     )
   }

   /*
   Func Name: resetListing
   Purpose: Erase all the listing that are displayed
   */
   resetListing(){
     this.setState(
       {
         posts: [],
         pageNumber: 1
       }
     )
   }

  render() {
    const {posts,togglePopup,savePost} = this.state;
    var postings = <GreetPage message="NEED A JOB?" btnLabel="CLICK TO SEE SOFTWARE JOB POSTINGS" clickAction={this.addMore} displaySaveToggle={this.displaySaved}/>;

    if(togglePopup){
      var popUp = <PopupWindow saveClick={this.savePost} toggle={this.jobClick} data = {this.state.popWindowInfo}/>
    }
    else{
      popUp = null;
    }

    if(this.state.saveToggle || posts.length > 0){
        postings = <PostingDisplay displaySaveToggle={this.displaySaved} saved={this.state.savedPost} displaySave={this.state.saveToggle} jobClick={this.jobClick} posts= {posts} clickAddAction={this.addMore} clickResetAction={this.resetListing} moreBtnLabel="MORE JOB POSTINGS" resetBtnLabel="ERASE ALL LISTINGS"/>
    }
   
    return (
      <div className="App">
        <div className="app-shield">
          {popUp}
          {postings}
        </div>  
      </div>
    );
  }
}

export default App;
