import {RootStackScreenProps} from "../types";
import {Image, View} from "react-native";
import wp, {ArticleFilter, getAllPosts} from "../constants/api";
import React, {useContext} from "react";
import SmallArticle from "../components/Article/SmallArticle";
import {UseCollapsibleOptions} from "react-navigation-collapsible";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import {getDomainIcon} from "../components/SearchItem";
import {Title} from "../components/Themed";
import {NativeStackNavigationOptions} from "@react-navigation/native-stack";
import IconButton from "../components/IconButton";
import {Subscription} from "../components/Article/logic";
import {SubscriptionsContext} from "../constants/context";
import InfiniteScroll from "../components/InfiniteScroll";

export function SearchDetailsScreen({route}: RootStackScreenProps<"SearchDetails">) {
  const {domain, id} = route.params;
  const articles = getAllPosts(wp.posts().param({[getDomainSearchParam(domain)]: id}).perPage(50));

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      headerTitle: () => <SearchDetailsHeader {...route.params} />,
      headerStyle: { height: 180 },
    } as NativeStackNavigationOptions,
  };

  return (
    <InfiniteScroll
      collapsibleHeader={true}
      collapsibleOptions={options}
      iterator={articles}
      renderItem={({item}) => <SmallArticle data={item} />}
      keyExtractor={item => "" + item.id}
    />
  );
}

function getDomainSearchParam(domain: ArticleFilter) {
  switch (domain) {
    case "Authors":
      return "author";
    case "Tags":
      return "tags";
    case "Topics":
      return "categories";
  }
}

function SearchDetailsHeader(props: Subscription) {
  const {img, domain, title, id} = props;
  const colorScheme = Colors[useColorScheme()];
  const [subscriptions, toggleSubscriptions] = useContext(SubscriptionsContext);

  return(
    <View style={{alignItems: "center"}}>
      <View style={{
        width: 96,
        height: 96,
        borderRadius: 1000,
        backgroundColor: colorScheme.tabIconDefault,
        alignItems: "center",
        justifyContent: "center"
      }}>
        {img &&
          <Image style={{borderRadius: 1000, width: 96, height: 96}} source={{uri: img}}/>
        }
        {!img &&
          <MaterialIcons
            name={getDomainIcon(domain)}
            size={80}
            color={colorScheme.text}
          />
        }
      </View>
      <View style={{flexDirection: "row", alignItems: "center", marginTop: -10}}>
        <IconButton icon={id in subscriptions ? "bell" : "bell-o"} action={toggleSubscriptions.bind(null, props)} />
        {/* for the text to be perfectly centered, padding should be 55, but I think this looks better*/}
        <Title style={{paddingRight: 33}}>{title}</Title>
      </View>
    </View>
  );
}
