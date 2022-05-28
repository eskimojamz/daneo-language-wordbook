import { RouteProp, useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";

type Param = {
    Dictionary: {
        term: string;
    };
};
export default function Dictionary() {
    const route = useRoute<RouteProp<Param, 'Dictionary'>>()
    return (
        <WebView source={{ uri: ('https://korean.dict.naver.com/koendict/#/search?range=all&query=' + route?.params?.term) }}
            style={{ flex: 1 }}
        />
    )
}