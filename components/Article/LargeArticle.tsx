import { CategoryLabel, Italics, Text, Title } from "../Themed";
import { ArticleProps } from "./logic";
import ArticleContainer from "./ArticleContainer";
import ArticleImage from "./ArticleImage";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import { View } from "react-native";

export default function LargeArticle(props: ArticleProps) {
  const { imgUrl, title, excerpt, categories, author } = props.data;
  return (
    <ArticleContainer {...props}>
      <View style={{ gap: 8 }}>
        <ArticleImage src={imgUrl} />
        <CategoryLabel style={{ marginTop: 10 }}>
          {Object.keys(categories).join(", ")}
        </CategoryLabel>
        <Title>{title}</Title>
        {/*TODO: add a little picture?*/}
        <Italics>{author.name}</Italics>
        <Text>{excerpt}</Text>
      </View>
    </ArticleContainer>
  );
}
