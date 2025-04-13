type Props = {
	width?: string;
	height?: string;
};
const CrossIcon = ({ width = '24', height = '24' }: Props) => (
	<svg
		viewBox="0 0 24 24"
		width={width}
		height={height}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
		<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M6 6L18 18M18 6L6 18"
				stroke="#ffffff"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</g>
	</svg>
);
export default CrossIcon;
