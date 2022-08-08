import { MainPageHeader } from "../../components/MainPage/MainPageHeader";
import { MainPageFooter } from "../../components/MainPage/MainPageFooter";
import { MainPageBody } from "../../components/MainPage/MainPageBody";

export function MainPage(Props) {
	return (
		<div className="main-page-container">
			<MainPageHeader />
			<MainPageBody />
			<MainPageFooter />
		</div>
	);
}
