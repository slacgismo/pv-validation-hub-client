'use client';
// *********** START OF IMPORTS ***********

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { GridColDef } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// *********** MODULE IMPORTS ***********

import SubmissionService from '@/services/submission_service';
import AnalysisService from '@/services/analysis_service';
import UserService from '@/services/user_service';
import CookieService from '@/services/cookie_service';
import { EditableInput } from '@/app/modules/global/editableComponents';

import { FormattedSubmission } from '@/services/submission_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type Analysis = {
	analysis_id: number;
	analysis_name: string;
};

const LONG_POLLING_INTERVAL = 5000;

/**
 * Component to display the list of submissions
 * @param {function} onClick
 * @constructor
 * @return {JSX.Element}
 */
export default function SubmissionList() {
	const [availableAnalyses, setAvailableAnalyses] = useState<Analysis[]>([]);
	const [submissions, setSubmissions] = useState<FormattedSubmission[]>([]);
	const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
	const [
		number_of_submissions_in_progress,
		setNumber_of_submissions_in_progress,
	] = useState<number>(0);

	const handleNameChange = (id: number, newValue: string) => {
		setSubmissions((prevSubmissions) =>
			prevSubmissions.map((submission) =>
				submission.id === id
					? { ...submission, altName: newValue }
					: submission
			)
		);
	};

	const handleSetName = async (id: number, newValue: string) => {
		const user = CookieService.getUserCookie();
		const userId = await UserService.getUserId(user.token);
		await SubmissionService.updateName(user.token, userId, id, newValue);
	};

	const handleArchive = async (id: number, archived: boolean) => {
		const user = CookieService.getUserCookie();
		const userId = await UserService.getUserId(user.token);
		await SubmissionService.archiveSubmission(
			user.token,
			userId,
			id,
			archived
		);

		// Remove the submission from the list
		setSubmissions((prevSubmissions) =>
			prevSubmissions.filter((submission) => submission.id !== id)
		);
	};

	const headers: GridColDef[] = [
		{
			field: 'altName',
			headerName: 'Submissions',
			flex: 2,
			filterable: false,
			sortable: false,
			groupable: false,
			renderCell: (params: any) => {
				const { value, id, row } = params;
				const { submittedAt } = row;

				const onChange = (newValue: string) => {
					setIsEditing((prev) => ({ ...prev, [id]: true }));
					handleNameChange(id, newValue);
				};
				const onClick = () => {
					setIsEditing((prev) => ({ ...prev, [id]: false }));
					handleSetName(id, value);
				};

				if (
					value !== null &&
					value !== undefined &&
					value !== 'N/A' &&
					(value.length > 0 || isEditing[id])
				) {
					return (
						<EditableInput
							value={value}
							onChange={(e) => onChange(e.target.value)}
							onClick={onClick}
						/>
					);
				} else if (
					id !== null &&
					id !== undefined &&
					submittedAt !== null &&
					submittedAt !== undefined
				) {
					return (
						<EditableInput
							value={`Submission_${id}_${submittedAt}`}
							onChange={(e) => onChange(e.target.value)}
							onClick={onClick}
						/>
					);
				} else {
					return 'N/A';
				}
			},
		},
		{
			field: 'analysis',
			headerName: 'Tasks',
			flex: 1,
			filterable: false,
			sortable: false,
			groupable: false,
			renderCell: (params: any) => {
				const value = params.value as Analysis;
				return (
					<Link
						href={`/analyses/analysis/?analysisId=${value.analysis_id}`}
						className="standardLink"
					>
						{value.analysis_name}
					</Link>
				);
			},
		},
		{
			field: 'status',
			headerName: 'Status',
			headerAlign: 'center',
			align: 'center',
			flex: 1,
			filterable: false,
			sortable: false,
			groupable: false,
			headerClassName: 'text-center',
			renderCell: (params: any) => {
				const { value } = params;
				return <div>{getIcon(value)}</div>;
			},
		},
		{
			field: 'submittedAt',
			headerName: 'Submission Date',
			headerAlign: 'center',
			align: 'center',
			flex: 2,
			valueGetter: (params: any) => {
				const formatDate = new Date(params).toLocaleString('en-US');
				return params !== null && params !== undefined
					? formatDate
					: 'N/A';
			},
		},
		{
			field: 'ttc',
			headerName: 'Time to Completion',
			flex: 1,
			filterable: false,
			sortable: false,
			groupable: false,
			renderCell: (params: any) => {
				const { value } = params;
				if (value !== null || value !== undefined) {
					return <div className="">{value}</div>;
				} else {
					return 'N/A';
				}
			},
		},
		{
			field: 'actions',
			headerName: 'Actions',
			flex: 1,
			filterable: false,
			sortable: false,
			groupable: false,
			renderCell: (params: any) => {
				const { id, row } = params;
				const { archived } = row;

				const onClick = () => handleArchive(id, !archived);

				return (
					<button onClick={onClick} className="standardLink">
						{archived ? 'Unarchive' : 'Archive'}
					</button>
				);
			},
		},
		{
			field: 'private_report',
			headerName: 'Private Report',
			headerAlign: 'center',
			align: 'center',
			flex: 1,
			renderCell: (params: any) => {
				const { id } = params;
				const pub = false;
				if (id !== null && id !== undefined && id !== 'N/A') {
					return (
						<Link
							href={`/mysubmissions/private_report?sid=${id}&pub=${pub}`}
							className="standardLink"
						>
							View Now
						</Link>
					);
				} else {
					return 'N/A';
				}
			},
		},
	];

	const onClick = (e: any) => {
		fetchSubmissions();
	};

	const onClickArchived = (e: any) => {
		fetchSubmissions();
	};

	const fetchSubmissions = async () => {
		const user = CookieService.getUserCookie();
		const userId = await UserService.getUserId(user.token);
		SubmissionService.getAllSubmissionsForUser(userId)
			.then((fetchedSubmissions) => {
				// eslint-disable-next-line
				const formattedSubs =
					SubmissionService.formatAllSubmissionsForUser(
						fetchedSubmissions
					).sort((a, b) => a.id - b.id);

				console.log('formattedSubs', formattedSubs);
				setSubmissions(formattedSubs);
			})
			.catch((error) => {
				console.error('Error fetching submissions:', error);
			});
		AnalysisService.getAllAnalyses()
			.then((analyses) => {
				setAvailableAnalyses(analyses.data);
			})
			.catch((error) => {
				console.error('Error fetching analyses:', error);
			});
	};

	useEffect(() => {
		fetchSubmissions();
	}, []);

	const getIcon = (status: string) => {
		switch (status) {
			case 'submitted':
				return <span className="pal-black">Queued</span>;
			case 'running':
				return <span className="pal-yellow">In Progress</span>;
			case 'failed':
				return <span className="pal-red">Failed</span>;
			case 'finished':
				return <span className="pal-green">Success</span>;
			default:
				return null;
		}
	};

	const list_of_statuses_for_refresh = ['running', 'submitted', 'submitting'];

	const submissionsInProgress = submissions.filter((submission) =>
		list_of_statuses_for_refresh.includes(submission.subStatus)
	);

	if (number_of_submissions_in_progress !== submissionsInProgress.length)
		setNumber_of_submissions_in_progress(submissionsInProgress.length);

	console.log(`submissions in progress: ${submissionsInProgress.length}`);

	useEffect(() => {
		let interval: NodeJS.Timeout | undefined = undefined;
		if (submissionsInProgress.length > 0) {
			interval = setInterval(() => {
				fetchSubmissions();
			}, LONG_POLLING_INTERVAL);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [number_of_submissions_in_progress]);

	return (
		<div
			className="
    min-w-full
    "
		>
			<h1 className="text-3xl font-bold text-center mb-5">
				My Submissions
			</h1>
			<div className="flex justify-center">
				<button
					className="
              tableBorder
              bg-white
              p-1
              hover:bg-pal-500
          "
					data-analysisid={0}
					onClick={onClick}
				>
					All Submissions
				</button>
				{availableAnalyses.map((analysis) => {
					return (
						<button
							key={analysis.analysis_id}
							className="
              tableBorder
              bg-white
              ml-3
              p-1
              hover:bg-pal-500
              "
							data-analysisid={analysis.analysis_id}
							onClick={onClick}
						>
							{analysis.analysis_name}
						</button>
					);
				})}
				<button
					className="
						tableBorder
						bg-white
						ml-3
						p-1
						hover:bg-pal-500
				"
					data-analysisid={'archived'}
					onClick={onClickArchived}
				>
					Archived
				</button>
			</div>
			<div
				className="
    min-w-full
    bg-white
    tableBorder
    mt-5
    "
			>
				<DataGrid
					columns={headers}
					rows={Array.isArray(submissions) ? submissions : []}
					slots={{
						toolbar: GridToolbar,
					}}
					hideFooterPagination={true}
				/>
			</div>
		</div>
	);
}
