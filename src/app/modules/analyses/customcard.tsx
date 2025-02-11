'use client';
// *********** START OF IMPORTS ***********

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Grid2 } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Markdown from 'markdown-to-jsx';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * CustomizedCard component
 * @param {object} props
 * @param {number} props.index
 * @param {object} props.card
 * @param {function} props.onClick
 * @param {string} props.testId
 * @return {JSX.Element}
 */
export default function CustomizedCard({
	index,
	card,
	onClick,
	testId,
}: {
	index: number;
	card: any;
	onClick: Function;
	testId: string;
}) {
	const [shortDescription, setShortDescription] = useState('');
	const [cardDir, setCardDir] = useState('');

	useEffect(() => {
		if (
			card.analysis_id !== undefined &&
			card.analysis_id !== null &&
			(card.analysis_id > 0 || card.analysis_id === 'development')
		) {
			setCardDir(
				`/static/assets/analysis/${card.analysis_id}/cardCover.png`
			);
			fetch(`/static/assets/analysis/${card.analysis_id}/shortdesc.md`)
				.then((res) => res.text())
				.then((text) => setShortDescription(text))
				.catch((err) => console.log(err));
		}
	}, [card.analysis_id]);

	return (
		<Grid2 sx={{ xs: 2, sm: 4, md: 4 }} key={index}>
			{cardDir && (
				<Card
					sx={{ maxWidth: 345, height: 380 }}
					key={card.analysis_id}
					onClick={() =>
						onClick(card.analysis_id, card.analysis_name)
					}
					data-testid={testId}
					className="
        tableBorder
        justify-center
        content-center
        text-center
        "
				>
					<Image
						src={cardDir}
						alt={card.analysis_name}
						width={325}
						height={380}
						className="
          object-fill
          content-center
          tableBorder
          analysisCard
          m-5
          "
					/>

					<CardHeader
						sx={{ height: 61 }}
						title={card.analysis_name}
					/>
					<CardContent>
						<Markdown className="reactMarkdown">
							{shortDescription !== undefined &&
							shortDescription.length > 100
								? `${shortDescription.slice(0, 100)}.....`
								: shortDescription}
						</Markdown>
					</CardContent>
				</Card>
			)}
		</Grid2>
	);
}
