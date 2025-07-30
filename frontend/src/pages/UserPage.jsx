import { useParams } from "react-router-dom";
// ✅ 더 간결한 경로로 통일합니다.
import UserMainPage from "../components/UserMainPage";

const UserPage = () => {
    // 참고: 이 파일은 URL 파라미터를 userId가 아닌 userName으로 받고 있습니다.
    const { userName } = useParams();

    return <UserMainPage userName={userName} />;
};

export default UserPage;