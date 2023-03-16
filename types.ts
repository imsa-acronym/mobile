/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FullArticle, Subscription} from "./components/Article/logic";
import {ArticleFilter, SearchDomain} from "./constants/api";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
  // Tried but no luck https://stackoverflow.com/a/72080205
  type MaterialIconName = any;
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  Notifications: undefined;
  Search: {
    query: string,
    domain: SearchDomain,
    // Defaults to false. When enabled, clicking on a result will add it to your notifications (subscriptions) instead of opening the page
    addNotifications?: boolean,
  };
  SearchDetails: Subscription,
  Article: { body: FullArticle };
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  FeedTab: undefined;
  SavedTab: undefined;
  GamesTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;