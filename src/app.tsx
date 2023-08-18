import React, { ChangeEvent, MouseEvent, Component } from "react";
import { Drafter } from "./drafter";

type Page = "create" | "draft" | "error"; 


interface AppState {
  page: Page;
  currentId: number;
  // Tell the user about something bad that happened.
  error?: string;

  inputDrafterName: string;
  inputId: string;
  inputRounds: string;
  inputOptions: string;
  inputDrafters: string;
}

// Top-level component that displays the appropriate page.
export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {page: "create", currentId: -1, inputDrafterName: "", inputId: "", inputRounds: "", inputOptions: "", inputDrafters: ""};
  }

  
  render = (): JSX.Element => {
    if (this.state.page === "create") {
      return (
        <div>
            <p className="pretext">Drafter:</p>
            <input type="text" value={this.state.inputDrafterName} onChange={this.handleNameChange}></input>
        
            <h2>Join Existing Draft</h2>    
            <p className="pretext">Draft ID:</p>
            <input type="number" min="1" value={this.state.inputId} onChange={this.handleIdChange}></input>
            <button type="button" onClick={this.handleJoin}>Join</button>



            <h2>Create New Draft</h2>
            <p className="pretext">Rounds:</p>
            <input type="number" min="1" value={this.state.inputRounds} onChange={this.handleRoundChange}></input>
    
            <p className="pretext">Options (one per line)</p>
            <textarea name="options" rows={10} cols={35} 
            onChange={this.handleOptionsChange}>
            </textarea>
    
            <p className="pretext">Drafters (one per line, in order)</p>
            <textarea name="drafters" rows={10} cols={35} 
            onChange={this.handleDraftersChange}>
            </textarea>
    
            <br/>
    
            <button type="button" onClick={this.handleSave}>Create</button>
        </div>
        );
    } else if (this.state.page === "error") {
      return <h1>Error: {this.state.error}</h1>
    } else {
      return <Drafter id={this.state.currentId} username={this.state.inputDrafterName}/>
    }
  };


  handleSave = (_: MouseEvent<HTMLButtonElement>): void => {
    // if (this.state.inputDrafterName.length > 0 && this.state.inputDrafters.length > 0 && 
    //     this.state.inputOptions.length > 0 && this.state.inputRounds.length > 0) {
      const url = "/api/save" +
          "?rawOptions=" + encodeURIComponent(this.state.inputOptions) +
          "&rounds=" + encodeURIComponent(this.state.inputRounds) +
          "&rawDrafters=" + encodeURIComponent(''+this.state.inputDrafters) +
          "&name=" + encodeURIComponent(''+this.state.inputDrafterName);
      fetch(url, {method: "POST"})
        .then(this.handleSaveResponse)
        .catch(this.handleServerError);
    //}
  };

  handleSaveResponse = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.handleSaveJson).catch(this.handleServerError);
    } else {
      this.handleServerError(res);
    }
  }

  handleSaveJson = (val: any) => {
    const id = val.idName;
    this.setState({page: "draft", currentId: id})
  };

  
  handleServerError = (res: Response): void => {
    console.log("Failed to create the requested draft");
    res.text().then(this.handleServerText).catch(this.handleServerTextError);
  }

  handleServerText = (text: string): void => {
    this.setState({page: "error", error: text});
  }

  handleServerTextError = (_: Response): void => {
    console.log("server text error");
  }

  handleJoin = (): void => {
    const url = "/api/load" +
          "?id=" + this.state.inputId +
          "&name=" + this.state.inputDrafterName;
    fetch(url)
        .then(this.handleLoad)
        .catch(this.handleServerError);
  }

  
  handleLoad = (res: Response): void => {
    if (res.status === 200) {
        res.json().then(this.handleLoadJson).catch(this.handleServerError);
      } else {
        this.handleServerError(res);
      }
  }

    // Called with the JSON of the response from /load
  handleLoadJson = (vals: any) => {
    if (typeof vals !== "object" || vals === null) {
      console.log("bad data from /load: no drafts", vals)
      return;
    }

    this.setState({page: "draft"});
  };





  /**
   *  TEXTBOX CHANGE EVENTS
   */
  // Called when the user changes the text in the Drafter box.
  handleNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({inputDrafterName: evt.target.value})
  };

  // Called when the user changes the text in the Id box.
  handleIdChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({inputId: evt.target.value, currentId: parseInt(evt.target.value)})
  };

  // Called when the user changes the text in the Rounds box.
  handleRoundChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({inputRounds: evt.target.value})
  };

  // Called when the user changes the text in the Options box.
  handleOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({inputOptions: evt.target.value})
  };

   // Called when the user changes the text in the Drafters box.
   handleDraftersChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({inputDrafters: evt.target.value})
  };

}

