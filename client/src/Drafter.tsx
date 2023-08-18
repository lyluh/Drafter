import React, { ChangeEvent, Component } from "react";
import { Draft } from "./draft";

type Page = "create" | "draft" | "error"; 

type DrafterProps = {
    /** Initial state of the draft */
    username: string;
    id: number;
    //onDraft: (draft: Draft) => any;
}


interface DrafterState {
    currentDraft?: Draft;
    currentUser: string;
    page: Page;
    selection: string;
    // Tell the user about something bad that happened.
    error?: string;
}


export class Drafter extends Component<DrafterProps, DrafterState> {

  constructor(props: DrafterProps) {
    super(props);

    this.state = {page: "draft", selection: "Hasn't been properly initialized", currentUser: this.props.username};
  }

  // when we go to draft page, load the draft requested with the given id
  componentDidMount = () => {
    const url = "/api/load" +
          "?id=" + this.props.id +
          "&name=" + this.state.currentUser;
    fetch(url)
        .then(this.handleLoad)
        .catch(this.handleServerError);
  };
  
  render = (): JSX.Element => {
    if (this.state.currentDraft === undefined) {
        this.handleServerError;
        return <h1>Error: Couldn't find Draft!</h1>;
    }
    if (this.state.page === "error") {
        return <h1>Error: {this.state.error}</h1>
    }

    let position = this.state.currentDraft.picks.length % this.state.currentDraft.drafters.length;
    let display;

    if (this.state.currentDraft.options.length === 0 || 
        this.state.currentDraft.rounds === this.state.currentDraft.picks.length) {
        display = <p>Draft has ended.</p>
    } else if (this.state.currentUser === this.state.currentDraft.drafters[position]) { // it is the user's turn
        let options: JSX.Element[] = [];
        for (const option of this.state.currentDraft.options) {
            options.push(
                <option value={option}>{option}</option>
            );
        }
        display = 
            <div>
                <p>It's your pick!</p>
                <select name="options" onChange={this.handleSelectionChange}>
                    {options}
                </select>
                <button type="button" onClick={this.handleSelect}>Draft</button>
            </div>;
    } else { // not the users turn
        display = 
            <div>
                <p>Waiting for {this.state.currentDraft.drafters[position]} to pick.</p>
                <button type="button" onClick={this.handleRefresh}>Refresh</button>
            </div>;
    }

    const table: JSX.Element[] = 
    [<tr>
        <td><strong>Num</strong></td>
        <td><strong>Pick</strong></td>
        <td><strong>Drafter</strong></td>
    </tr>];

    // everytime something is selected, then push in a new row
    for (let i = 0; i < this.state.currentDraft.picks.length; i++) {
        table.push(
            <tr>
                <td>{i+1}</td>
                <td>{this.state.currentDraft.picks[i]}</td>
                <td>{this.state.currentDraft.drafters[i%this.state.currentDraft.drafters.length]}</td>
            </tr>
        );
    }
    
    return (
        <div>
            <h2>Status of Draft {this.state.currentDraft.id}</h2>
            <table>
                {table}
            </table>
            {display}
        </div>
    );
  };

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

    this.setState({page: "draft", currentDraft: vals, selection: vals.options[0]});
  };

  handleServerError = (res: Response): void => {
    console.log("Failed to load the requested draft");
    res.text().then(this.handleServerText).catch(this.handleServerTextError);
  }

  handleServerText = (text: string): void => {
    this.setState({page: "error", error: text});
  }

  handleServerTextError = (_: Response): void => {
    console.log("server text error");
  }

  
  // TODO FIX TIHS AND ERRORS: error when picking the ifrs toption that appears in the list
  // event handler for selecting an option from list of options
  // a: jepsen, b: rae, a: carly / jepsen 
  // so selection became the preiously selected one somehow

  // a: carly / "", selection was not correctly parsed
  handleSelect = (): void => {
    const url = "/api/selectOption" +
          "?id=" + this.props.id +
          "&selection=" + this.state.selection;
    fetch(url)
        .then(this.handleSelectResponse)
        .catch(this.handleServerError);
  }

  handleSelectResponse = (res: Response): void => {
    if (res.status === 200) {
        res.json().then(this.handleSelectJson).catch(this.handleServerError);
    } else {
        this.handleServerError(res);
    }
  }

  handleSelectJson = (vals: any) => {
    if (typeof vals !== "object" || vals === null) {
        console.log("bad data from /selectOption: no drafts", vals)
        return;
    }
    this.setState({page: "draft", currentDraft: vals})
  }

  // reload the page
  handleRefresh = (): void => {
    const url = "/api/load" +
          "?id=" + this.props.id +
          "&name=" + this.state.currentUser;
    fetch(url)
        .then(this.handleLoad)
        .catch(this.handleServerError);  }


  // Called when the user changes the selection.
  handleSelectionChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({selection: evt.target.value});
  };


}
