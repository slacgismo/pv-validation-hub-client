'use client';
// *********** START OF IMPORTS ***********

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import DoneIcon from '@mui/icons-material/Done';
import Checkbox from '@mui/material/Checkbox';

// *********** MODULE IMPORTS ***********

import SubmissionService from '@/services/submission_service';
import UserService from '@/services/user_service';
import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type Submissions = {
    submission_id: number;
    status: string;
    submitted_at: number;
  }

/**
 * Component to display the list of submissions
 * @param {function} onClick
 * @constructor
 * @return {JSX.Element}
 */
export default function SubmissionList({onClick}: {onClick: any}) {
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
    console.log(status);
    switch (status) {
      case 'submitted':
        return <CheckCircleOutlineIcon />;
      case 'running':
        return <QueryBuilderIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'finished':
        return <DoneIcon />;
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
        return (
          <ListItem key={sid} disablePadding>
            <ListItemButton dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  inputProps={{'aria-labelledby': labelId}}
                />
              </ListItemIcon>
              <ListItemIcon>
                {getIcon(sub.status)}
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`Submission ${sid}`} />
              <ListItemIcon onClick={() => onClick(sid)}>
                <Link
                  href={
                    `/mysubmissions/private_report?sid=${sid}&pub=${pub}`
                  }
                  className="standardLink">
                View Report
                </Link>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
