import {createContext} from "react";
import {useBookmarks, useSubscriptions} from "../components/Article/logic";
import {getAllCategories} from "./api";
import useAsyncStorage, {ObservableStorage} from "../hooks/useAsyncStorage";

export const BookmarkContext = createContext([{}, ()=>{}] as ReturnType<typeof useBookmarks>);
export const SubscriptionsContext = createContext([{}, ()=>{}] as ReturnType<typeof useSubscriptions>);
/// Since topics should not change while app is running, cache them here so they don't have to be re-fetched every time search component is re-mounted
// TODO: since they are static, I can remove this
export const TopicsContext = createContext(Promise.resolve({}) as ReturnType<typeof getAllCategories>);
export const SizeContext = createContext({} as ObservableStorage<number>);
