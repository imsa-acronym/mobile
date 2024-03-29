import React, {PropsWithChildren, useEffect, useState} from "react";
import {Animated, Dimensions, FlatList, FlatListProps, RefreshControl} from "react-native";
import useAsyncIterator from "../hooks/useAsyncIterator";
import {UseCollapsibleOptions} from "react-navigation-collapsible";
import constructInfiniteScrollHandler from "./constructInfiniteScrollHandler";
import useCollapsibleHeaderMixin from "../mixins/useCollapsibleHeaderMixin";
import WithAnimatedValue = Animated.WithAnimatedValue;
import * as SplashScreen from "expo-splash-screen";

// I'm using this instead of the mixin strategy because all CollapsableHeaderLists are also InfiniteScrollLists (for now)
// TODO: should I allow passing the full AnimatedProps<FlatListProps<ItemT>>?
export default function InfiniteScroll<ItemT>({collapsibleHeader=false, collapsibleOptions={}, iterator, children, ListEmptyComponent, ...flatListProps}:
                                              PropsWithChildren<{collapsibleHeader?: boolean, collapsibleOptions?: Partial<UseCollapsibleOptions>, iterator: ReturnType<typeof useAsyncIterator<ItemT>> | AsyncIterator<ItemT>}>
                                                & Omit<FlatListProps<ItemT>, "children" | "data" | "onScroll" | "refreshControl" | "ListHeaderComponent" | keyof ReturnType<typeof useCollapsibleHeaderMixin>>) {
  const ListImplementation = collapsibleHeader ? Animated.FlatList : FlatList;
  const [refreshing, setRefreshing] = React.useState(true);

  const [articles, next] = iterator instanceof Array ? iterator : useAsyncIterator(iterator);
  const [iterState, setIterState] = useState(iterator);
  if (iterState != iterator) {
    setIterState(iterator);
    setRefreshing(true);
  }
  // Load the first 10 articles b/c waiting for all images Promise.all is too long. Images get queued right away
  useEffect(() => {
    if (articles.length === 0) {
      console.log("I should fetch new stuff!");
      for (let i=0; i<9; i++) next();
      // don't hide loading until all are loaded (particularly an issue for SearchScreen, where category info appears before posts)
      next().then(() => {
        setRefreshing(false);
        SplashScreen.hideAsync();
      });
    }
  }, [articles]);

  let onScroll = constructInfiniteScrollHandler(next);
  let usedCollapsibleHeaderMixin: {} | ReturnType<typeof useCollapsibleHeaderMixin> = {};
  let containerPaddingTop = 0;

  if (collapsibleHeader) {
    const mixin = useCollapsibleHeaderMixin(onScroll, collapsibleOptions);
    usedCollapsibleHeaderMixin = mixin;  // Redundant for type checking
    containerPaddingTop = mixin.contentContainerStyle.paddingTop;
  }

  // TODO: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 11827.4287109375, "dt": 831, "prevDt": 807}
  return (
    <ListImplementation
      onScroll={onScroll}
      showsVerticalScrollIndicator={false}
      {...usedCollapsibleHeaderMixin}
      refreshControl={
        <RefreshControl refreshing={refreshing} enabled={false} progressViewOffset={containerPaddingTop} />
      }
      ListHeaderComponent={<>{children}</>}
      ListEmptyComponent={refreshing ? undefined : ListEmptyComponent}
      data={articles as WithAnimatedValue<ItemT>[] /* complains without the cast. I don't use any of these types, so it shouldn't matter*/}
      onContentSizeChange={(width, height) => {
        if (height < Dimensions.get('window').height && !refreshing)
          next();
      }}
      {...flatListProps}
    />
  );
}
