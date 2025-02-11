'use client';
// *********** START OF IMPORTS ***********

import React, { useState, useEffect } from 'react';
import {
	Box,
	Grid,
	Tab,
	Tabs,
	Typography,
	CircularProgress,
} from '@mui/material';
import { Container } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import TabPanel from '@/app/modules/analyses/tabpanel';
import Leaderboard from '@/app/modules/analyses/leaderboard/leaderboard';
import Overview from '@/app/modules/analyses/leaderboard/overview';
import Rules from '@/app/modules/analyses/leaderboard/rules';
import AnalysisService from '@/services/analysis_service';
import SubmissionUploader from '@/app/modules/analyses/upload/uploader';
import replaceImagePaths from '@/config/mdurl';
import MS from '@/services/md_service';
import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

import { useAppSelector } from '@/store/store';
import { useDispatch } from 'react-redux';
import { logIn } from '@/reducers/user';

// *********** END OF IMPORTS ***********

type AnalysisDetailsCard = {
	analysisId: string | number;
	analysis_name: string;
};

const AnalysisPage: React.FC = () => {
	const searchParams = useSearchParams();
	const navigate = useRouter();
	const dispatch = useDispatch();

	const loggedIn = useAppSelector((state) => state.user.loggedIn);

	if (searchParams.get('analysisId') === null) {
		console.error('Analysis ID not found');
		navigate.push('/analyses');
	}

	let selectedAnalysis: string | number | null =
		searchParams.get('analysisId');
	let validAnalysisParam = false;

	// Check if the analysis ID is a number and store as variable due to typescript
	// limitations doing it directly in my next if statement
	if (selectedAnalysis !== null && selectedAnalysis !== 'development') {
		validAnalysisParam = isNaN(parseInt(selectedAnalysis.toString()));
	}

	if (
		selectedAnalysis !== 'development' &&
		selectedAnalysis !== null &&
		!validAnalysisParam
	) {
		selectedAnalysis = parseInt(selectedAnalysis.toString() || '', 10);
	} else if (
		selectedAnalysis !== null &&
		isNaN(parseInt(selectedAnalysis)) &&
		selectedAnalysis === 'development'
	) {
		console.log('Development analysis');
	} else {
		navigate.push('/analyses');
	}

	const [value, setValue] = useState(0);

	const [analysisId, setAnalysisId] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [analysisDetailsCard, setAnalysisDetailsCard] =
		useState<AnalysisDetailsCard>({
			analysisId: '',
			analysis_name: '',
		});

	// Set the md descriptions

	const [longDescription, setLongDescription] = useState('');
	const [rulesetDescription, setRulesetDescription] = useState('');
	const [coverImageDir, setCoverImageDir] = useState('');
	const [analysesBlurb, setAnalysesBlurb] = useState('');

	useEffect(() => {
		if (!loggedIn) {
			const userCookie = CookieService.getUserCookie();
			if (userCookie && userCookie.token) {
				dispatch(logIn(userCookie.username));
			}
		}
	}, [dispatch, loggedIn]);

	useEffect(() => {
		if (
			window.location.hostname.includes('127.0.0.1') &&
			selectedAnalysis === 'development'
		) {
			setAnalysisDetailsCard({
				analysisId: 'development',
				analysis_name: 'Dev Analysis',
			});
			setAnalysisId('development');
			setIsLoading(false);
			console.log('Loading development analysis');
		} else if (selectedAnalysis === null) {
			navigate.push('/analyses');
		} else {
			AnalysisService.getCardDetails(selectedAnalysis)
				.then((response: any) => {
					setIsLoading(false);
					setAnalysisDetailsCard(response.data);
					setAnalysisId(response.data.analysis_id);
				})
				.catch((e: any) => {
					setError(e);
					console.error('Error:', error);
					setIsLoading(false);
					setAnalysisDetailsCard({
						analysisId: 'development',
						analysis_name: 'Dev Analysis',
					});
				});
		}
	}, [selectedAnalysis, error, navigate]);

	useEffect(() => {
		if (
			selectedAnalysis !== undefined &&
			selectedAnalysis !== null &&
			((typeof selectedAnalysis === 'number' && selectedAnalysis > 0) ||
				(typeof selectedAnalysis === 'string' &&
					selectedAnalysis === 'development'))
		) {
			setCoverImageDir(
				`/static/assets/analysis/${selectedAnalysis}/banner.png`
			);

			MS.fetchMarkdown(
				`/static/assets/analysis/${selectedAnalysis}/description.md`
			)
				.then((text) => replaceImagePaths(text, selectedAnalysis))
				.then((text) => setLongDescription(text))
				.catch((err) => console.log(err));

			MS.fetchMarkdown(
				`/static/assets/analysis/${selectedAnalysis}/SubmissionInstructions.md`
			)
				.then((text) => replaceImagePaths(text, selectedAnalysis))
				.then((text) => setRulesetDescription(text))
				.catch((err) => console.log(err));

			MS.fetchMarkdown(
				`/static/assets/analysis/${selectedAnalysis}/shortdesc.md`
			)
				.then((text) => {
					setAnalysesBlurb(text);
				})
				.catch((error) => console.error(error));
		} else {
			console.error('Analysis ID not found');
		}
	}, [selectedAnalysis, coverImageDir]);

	const handleChange = (event: any, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main
				id="mainElement"
				className="flex min-h-screen flex-col
    items-center justify-between p-24"
			>
				{isLoading !== false ? (
					<CircularProgress />
				) : (
					<Container id="analysis">
						<Box
							sx={{
								flexGrow: 1,
								marginTop: 1,
								marginBottom: 3,
							}}
						>
							<div
								className="
                      grid
                      grid-cols-2
                      place-items-center
                  "
							>
								<div>
									<Typography
										color="black"
										variant="h4"
										gutterBottom
										className="
                      justify-center
                      text-center
                      "
									>
										{analysisDetailsCard.analysis_name}
									</Typography>
									<Typography
										color="black"
										gutterBottom
										className="
                      justify-center
                      text-center
                      mt-4
                      "
									>
										{analysesBlurb}
									</Typography>
								</div>

								{/* eslint-disable-next-line @next/next/no-img-element*/}
								<div
									style={{
										backgroundImage: `url(${coverImageDir})`,
									}}
									className="
                        relative
                        bg-cover
                        bg-no-repeat
                        bannerImage
                        "
								/>
							</div>
						</Box>

						<Box
							sx={{ width: '100%' }}
							className="
                  mt-1
                  tableBorder
                  bg-white
                "
						>
							<Box
								className="flex"
								sx={{
									borderBottom: 1,
									borderColor: 'divider',
									marginRight: 2,
								}}
							>
								<Grid container spacing={2}>
									<Grid item xs={6} md={10}>
										<Tabs
											value={value}
											onChange={handleChange}
											aria-label="basic tabs example"
											className="flex w-full"
										>
											<Tab
												label="Leaderboard"
												className="
                          panelTab
                          "
											/>
											<Tab
												label="Description"
												className="
                          panelTab
                          "
											/>
											<Tab
												label="Submission Instructions"
												className="
                          panelTab
                          "
											/>
											{loggedIn ? (
												<Tab
													label="Submit Algorithm"
													className="
                          panelTab
                          "
												/>
											) : (
												<Tab
													label="Submit Algorithm"
													disabled
													className="
                        panelTab
                        "
												/>
											)}
										</Tabs>
									</Grid>

									<Grid item xs={6} md={2}></Grid>
								</Grid>
							</Box>

							<TabPanel value={value} index={1}>
								<Overview
									title={`Overview of ${analysisDetailsCard.analysis_name}`}
									description={longDescription}
								/>
							</TabPanel>

							<TabPanel value={value} index={0}>
								<Leaderboard />
							</TabPanel>

							<TabPanel value={value} index={2}>
								<Rules
									title={analysisDetailsCard.analysis_name}
									description={rulesetDescription}
								/>
							</TabPanel>
							<TabPanel value={value} index={3}>
								<SubmissionUploader analysisId={analysisId} />
							</TabPanel>
						</Box>
					</Container>
				)}
			</main>
			<Footer />
		</div>
	);
};

export default AnalysisPage;
