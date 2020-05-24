import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TextInput, View } from 'react-native';
import HeaderButtons from 'react-navigation-header-buttons';

import Fire from '../Fire';

export default class NewPostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Bài viết mới',
    headerRight: (
      <HeaderButtons IconComponent={Ionicons} iconSize={23} color="black">
        <HeaderButtons.Item
          title="Chia sẻ"
          onPress={() => {
            const text = navigation.getParam('text');
            const image = navigation.getParam('image');
            if (text && image) {
              navigation.navigate("Feed");
              Fire.shared.post({ text: text.trim(), image });
            } else {
              alert('Need valid description');
            }
          }}
        />
      </HeaderButtons>
    ),
  });

  state = { text: '' };

  render() {
    const { image } = this.props.navigation.state.params;
    return (
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <Image
          source={{ uri: image }}
          style={{ resizeMode: 'contain', aspectRatio: 1, width: 72 }}
        />
        <TextInput
          multiline
          style={{ flex: 1, paddingHorizontal: 16 }}
          placeholder="Thêm mô tả..."
          onChangeText={text => {
            this.setState({ text });
            this.props.navigation.setParams({ text });
          }}
        />
      </View>
    );
  }
}
