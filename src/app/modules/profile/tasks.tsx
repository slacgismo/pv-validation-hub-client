'use client';
// *********** START OF IMPORTS ***********
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import DialogAction from '@mui/material/DialogActions';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

// *********** MODULE IMPORTS ***********

import CookieService from '@/services/cookie_service';
import UserService from '@/services/user_service';
import Elink from '@/app/modules/elink/elink';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

// *********** START OF TYPES ***********

 type SubmittedTasks = [string, string][];

// *********** END OF TYPES ***********

/**
 *
 * @param {SubmittedTasks} submittedTasks array of tuples of task id and task name
 * @return {JSX.Element}
 */
export default function ProfileTasks({
  submittedTasks,
}: {
    submittedTasks: SubmittedTasks
}) {
  const generateLinks = (tasks: SubmittedTasks) => {
    console.log(tasks);
    if (tasks.length === 0) {
      return <span>No tasks submitted</span>;
    }
    return tasks.map(([id, name]) => (
      <Link
        key={id}
        href={`/analyses/analysis/?analysisId=${id}`}
        className="
      standardLink
      ">
        {name}
      </Link>
    ));
  };
  return (
    <div
      className="
    text-center
    content-center
    justify-center
    align-center
    p-5
    flex
    flex-wrap
    ">
      {generateLinks(submittedTasks)}
    </div>
  );
}
