import firebase from "firebase";
import React, { Component } from "react";
import { LayoutAnimation, RefreshControl } from "react-native";

import List from "../components/List";
import Fire from "../Fire";
import PostContext from "../contexts/PostContext";

const PAGE_SIZE = 10;
console.disableYellowBox = true;
export default class FeedScreen extends Component {
  state = {
    loading: false,
    posts: [],
    data: {},
  };

  static contextType = PostContext;

  componentDidMount() {
    if (Fire.shared.uid) {
      this.makeRemoteRequest();
    } else {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.makeRemoteRequest();
        }
      });
    }
  }

  addPosts = (posts) => {
    this.setState((previousState) => {
      let data = {
        ...previousState.data,
        ...posts,
      };
      return {
        data,
        // Sort the data by timestamp
        posts: Object.values(data).sort((a, b) => a.timestamp < b.timestamp),
      };
    });
  };

  makeRemoteRequest = async (lastKey) => {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });

    const { data, cursor } = await Fire.shared.getPaged({
      size: PAGE_SIZE,
      start: lastKey,
    });

    this.lastKnownKey = cursor;
    // Iteratively add posts
    let posts = {};
    for (let child of data) {
      posts[child.key] = child;
    }
    this.addPosts(posts);
    this.context.setPosts(this.state.posts);

    this.setState({ loading: false });
  };

  _onRefresh = () => this.makeRemoteRequest();

  onPressFooter = () => this.makeRemoteRequest(this.lastKnownKey);

  render() {
    // Let's make everything purrty by calling this method which animates layout changes.
    LayoutAnimation.easeInEaseOut();
    return (
      <List
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this._onRefresh}
          />
        }
        onPressFooter={this.onPressFooter}
        data={this.context.posts}
      />
    );
  }
}
