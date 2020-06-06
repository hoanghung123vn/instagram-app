// Import React Navigation
import {
  createBottomTabNavigator,
  createStackNavigator,
  createNavigationContainer,
} from "react-navigation";
import React from "react";

import PostProvider from "./providers/PostProvider";
import tabBarIcon from "./utils/tabBarIcon";
import FeedScreen from "./screens/FeedScreen";
import NewPostScreen from "./screens/NewPostScreen";
import SelectPhotoScreen from "./screens/SelectPhotoScreen";

const navigator = createBottomTabNavigator(
  {
    Feed: {
      screen: FeedScreen,
      navigationOptions: {
        tabBarIcon: tabBarIcon("home"),
      },
    },
    Photo: {
      screen: SelectPhotoScreen,
      navigationOptions: {
        tabBarIcon: tabBarIcon("add-circle"),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "black",
      inactiveTintColor: "gray",
    },
  }
);

const stackNavigator = createStackNavigator(
  {
    Main: {
      screen: navigator,
      navigationOptions: { title: "Instagram Việt Nam 🤔" },
    },
    NewPost: NewPostScreen,
  },
  {
    cardStyle: { backgroundColor: "white" },
  }
);

const AppContainer = createNavigationContainer(stackNavigator);

export default function App() {
  return (
    <PostProvider>
      <AppContainer />
    </PostProvider>
  );
}
