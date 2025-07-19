import { useParams } from "react-router-dom";
// ❌ 수정 전:
// import UserMainPage from "@/src/components/UserMainPage";

// ✅ 수정 후:
import UserMainPage from "../../components/UserMainPage";


const UserPage = () => {
    const { userId } = useParams();
    return <UserMainPage userId={userId} />;
};

export default UserPage;