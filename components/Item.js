import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
} from "react-native";
import Fire from "../Fire";
import getUserInfo from "../utils/getUserInfo";

const profileImageSize = 30;
const padding = 10;

export default class Item extends React.Component {
  state = {
    isLiked: false,
    countLike: 0,
    isOpenComment: false,
    textComment: "",
    isEditing: false,
    comments: [],
  };
  componentDidMount() {
    if (!this.props.imageWidth) {
      // Get the size of the web image
      Image.getSize(this.props.image, (width, height) => {
        this.setState({ width, height });
      });
    }
    this.setState({
      isLiked: this.isLiked(),
      countLike: this.props.likedUserIds.length,
      comments: this.props.comments,
    });
  }

  like = () => {
    Fire.shared.like(
      this.props.id,
      this.props.likedUserIds.concat(getUserInfo().deviceId)
    );
    this.setState({ isLiked: true, countLike: this.state.countLike + 1 });
  };

  unLike = () => {
    Fire.shared.like(
      this.props.id,
      this.props.likedUserIds.filter((id) => id !== getUserInfo().deviceId)
    );
    this.setState({ isLiked: false, countLike: this.state.countLike - 1 });
  };

  isLiked = () => {
    const userId = getUserInfo().deviceId;
    return this.props.likedUserIds.includes(userId);
  };

  toggleComments = () => {
    this.setState({ isOpenComment: !this.state.isOpenComment });
  };

  onComment = () => {
    if (this.state.textComment.trim() === "") {
      return;
    }
    const comment = {
      userId: getUserInfo().deviceId,
      userName: getUserInfo().deviceName,
      content: this.state.textComment,
    };
    Fire.shared.comment(this.props.id, this.props.comments.concat(comment));
    this.setState({
      textComment: "",
      isEditing: false,
      comments: this.state.comments.unshift(comment),
      isOpenComment: true,
    });
  };

  render() {
    const { text, name, imageWidth, imageHeight, image } = this.props;
    // Reduce the name to something
    const imgW = imageWidth || this.state.width;
    const imgH = imageHeight || this.state.height;
    const aspect = imgW / imgH || 1;
    return (
      <View style={{ borderBottomColor: "#c5c5c5", borderBottomWidth: 1 }}>
        {/* Header post */}
        <View style={[styles.row, styles.padding]}>
          <View style={styles.row}>
            <Image style={styles.avatar} source={{ uri: image }} />
            <Text style={styles.text}>{name}</Text>
          </View>
        </View>
        {/* Image */}
        <Image
          resizeMode="contain"
          style={{
            backgroundColor: "#D8D8D8",
            width: "100%",
            aspectRatio: aspect,
          }}
          source={{ uri: image }}
        />
        {/* IconBar */}
        <View style={[styles.row, { paddingLeft: 10, paddingTop: 10 }]}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => (this.state.isLiked ? this.unLike() : this.like())}
            >
              <Icon
                name="md-heart"
                color={this.state.isLiked ? "red" : "black"}
              />
            </TouchableOpacity>
            <Icon name="ios-chatbubbles" color="black" />
            <Icon name="ios-send" color="black" />
          </View>
          <Icon name="ios-bookmark" color="black" />
        </View>
        {/* Liked */}
        <View style={{ paddingLeft: 10 }}>
          <Text>{this.state.countLike} người đã thích</Text>
        </View>
        {/* Post information */}
        <View style={styles.padding}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.subtitle}>{text}</Text>
        </View>
        {/* View Comment */}
        <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
          {this.props.comments.length > 0 ? (
            <View>
              <TouchableOpacity onPress={this.toggleComments}>
                <Text style={{ opacity: 0.8, color: "rgb(53, 181, 240)" }}>
                  Xem tất cả bình luận
                </Text>
              </TouchableOpacity>
              {this.state.isOpenComment &&
                this.props.comments.map((comment) => (
                  <View
                    key={comment.userId}
                    style={{ flexDirection: "row", paddingVertical: 5 }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginRight: 10,
                        opacity: 0.7,
                      }}
                    >
                      {comment.userName}
                    </Text>
                    <Text style={{ fontSize: 14 }}>{comment.content}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <Text style={{ fontSize: 12, opacity: 0.8 }}>
              Không có bình luận nào
            </Text>
          )}
        </View>
        {/* Add comment */}
        <View style={[styles.row, styles.padding]}>
          <View style={styles.row}>
            <Image
              style={styles.avatar}
              source={{ uri: "https://i.picsum.photos/id/237/200/200.jpg" }}
            />
            <TextInput
              placeholder="Thêm bình luận"
              value={this.state.textComment}
              onChangeText={(text) => this.setState({ textComment: text })}
              onFocus={() => this.setState({ isEditing: true })}
            ></TextInput>
            {this.state.isEditing && (
              <View style={{ marginLeft: 20 }}>
                <TouchableOpacity onPress={this.onComment}>
                  <View>
                    <Text
                      style={{
                        marginLeft: 140,
                        backgroundColor: "rgb(128, 228, 223)",
                        padding: 5,
                        borderRadius: 7,
                      }}
                    >
                      Bình luận
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const Icon = ({ name, color }) => (
  <Ionicons style={{ marginRight: 8 }} name={name} size={26} color={color} />
);

const styles = StyleSheet.create({
  text: { fontWeight: "600" },
  subtitle: {
    opacity: 0.8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  padding: {
    padding,
  },
  avatar: {
    aspectRatio: 1,
    backgroundColor: "#D8D8D8",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#979797",
    borderRadius: profileImageSize / 2,
    width: profileImageSize,
    height: profileImageSize,
    resizeMode: "cover",
    marginRight: padding,
  },
});
