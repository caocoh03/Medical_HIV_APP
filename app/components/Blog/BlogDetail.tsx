import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

type Blog = {
  image: string;
  title: string;
  date: string;
  source: string;
  content: string;
};

type RouteParams = {
  BlogDetail: {
    blog: Blog;
  };
};

const BlogDetail = () => {
  const route = useRoute<RouteProp<RouteParams, "BlogDetail">>();
  const { blog } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: blog.image }} style={styles.image} />
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.dateSource}>
          {blog.date} | {blog.source}
        </Text>
        <Text style={styles.content}>{blog.content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateSource: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default BlogDetail;
