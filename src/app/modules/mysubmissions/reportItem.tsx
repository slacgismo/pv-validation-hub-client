'use client';
// *********** START OF IMPORTS ***********

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

// *********** MODULE IMPORTS ***********

import SubmissionService from '@/services/submission_service';
import UserService from '@/services/user_service';
import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type Analysis = {
  analysis_id: number;
  analysis_name: string;
}

type Submissions = {
    submission_id: number;
    status: string;
    submitted_at: number;
    alt_name: string;
    analysis: Analysis;
  }

/**
 * Component to display the list of submissions
 * @param {function} onClick
 * @constructor
 * @return {JSX.Element}
 */
export default function SubmissionList() {
  const [submissions, setSubmissions] = useState<Submissions[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const user = CookieService.getUserCookie();
      const userId = await UserService.getUserId(user.token);
      SubmissionService.getAllSubmissionsForUser(userId)
          .then((fetchedSubmissions) => {
            setSubmissions(fetchedSubmissions);
          })
          .catch((error) => {
            console.error('Error fetching submissions:', error);
          });
    };

    fetchSubmissions();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return (<span className='pal-black'>
          Queued
        </span>);
      case 'running':
        return (<span className='pal-yellow'>
          In Progress
        </span>);
      case 'failed':
        return (<span className='pal-red'>
          Failed
        </span>);
      case 'finished':
        return (<span className='pal-green'>
          Success
        </span>);
      default:
        return null;
    }
  };

  return (
    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
      {submissions.sort(
          (a, b) => Number(new Date(b.submitted_at)) -
            Number(new Date(a.submitted_at)),
      ).map((sub) => {
        const sid = sub.submission_id;
        const labelId = `checkbox-list-label-${sid}`;
        const pub = false;
        const analysisName = sub.analysis.analysis_name;
        const subDate = new Date(
            sub.submitted_at
        ).toLocaleString('en-US');
        let subName;
        if (sub.alt_name.length > 0) {
          subName = sub.alt_name;
        } else {
          subName = `Submission_${sid}_${sub.submitted_at}`;
        }
        return (
          <ListItem key={sid} disablePadding>
            <ListItemButton dense>
              <Checkbox
                edge="start"
                tabIndex={-1}
                disableRipple
                inputProps={{'aria-labelledby': labelId}}
              />
              <ListItemText
                id={labelId}
                primary={subName}
                className='
                min-w-36
                '/>
              <ListItemText
                id={labelId}
                primary={analysisName} />
              <ListItemText
                id={labelId}
                primary={subDate} />
              <ListItemIcon>
                {getIcon(sub.status)}
              </ListItemIcon>
              <ListItemIcon>
                <Link
                  href={
                    `/mysubmissions/private_report?sid=${sid}&pub=${pub}`
                  }
                  className="standardLink">
                View Now
                </Link>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
