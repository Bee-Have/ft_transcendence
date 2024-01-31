import { MemberProps } from "./MemberProps.types";

export interface PopUpChannelProps {
	member: MemberProps;
	clicker: MemberProps;
	anchorEl: HTMLElement | null;
	setAnchorEl: (event: HTMLElement | null) => void;
}
