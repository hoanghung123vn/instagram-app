import React from "react";
import { FlatList } from "react-native";

import Footer from "./Footer";
import Item from "./Item";

class List extends React.Component {
  render() {
    const { onPressFooter, ...props } = this.props;
    return (
      <FlatList
        keyExtractor={(item) => item.key}
        ListFooterComponent={(footerProps) => (
          <Footer {...footerProps} onPress={onPressFooter} />
        )}
        renderItem={({ item }) => <Item {...item} />}
        {...props}
      />
    );
  }
}
export default List;
