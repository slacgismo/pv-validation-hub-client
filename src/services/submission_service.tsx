import client from "@/services/api_service";

const SubmissionService = {
  getAllSubmissionsForUser(userId: number) {
    if (typeof userId === "string") {
      throw new Error("Invalid user ID");
    }
    // 0 is the analysis ID for all submissions
    return client
      .get(`/submissions/user/${userId}/submissions/0`)
      .then((response) => response.data);
  },
  getAvailableAnalyses() {
    return client.get("/analyses").then((response) => response.data);
  },
  getSelectedSubmissionsForUser(userId: number, analysisId: number) {
    if (typeof userId === "string") {
      throw new Error("Invalid user ID");
    }
    if (typeof analysisId === "string") {
      throw new Error("Invalid analysis ID");
    }
    return client
      .get(`/submissions/user/${userId}/submissions/${analysisId}`)
      .then((response) => response.data);
  },
  getArchivedSubmissionsForUser(userId: number) {
    if (typeof userId === "string") {
      throw new Error("Invalid user ID");
    }
    return client
      .get(`/submissions/user/${userId}/submissions/archived`)
      .then((response) => response.data);
  },
  formatAllSubmissionsForUser(response: any) {
    const finalResponse = [];
    if (response.length > 0) {
      // ttc = time to completion
      console.log("response", response);
      for (let i = 0; i < response.length; i += 1) {
        let ttc;
        if (
          (response[i].current_file_count > 0 &&
            response[i].analysis.total_files %
              response[i].current_file_count ===
              0) ||
          response[i].status === "finished"
        ) {
          ttc = "Done";
        } else if (
          response[i].current_file_count === 0 &&
          response[i].status === "running"
        ) {
          ttc = "Calculating...";
        } else if (response[i].current_file_count > 0) {
          const filesLeft =
            response[i].analysis.total_files - response[i].current_file_count;
          const avgTime = response[i].avg_file_exec_time;
          const timeLeft = (filesLeft * avgTime).toFixed(0);
          ttc = `~${timeLeft} seconds`;
        } else {
          ttc = "Check Status";
        }
        const element = {
          id: response[i].submission_id,
          status: response[i].status,
          submittedAt: response[i].submitted_at,
          altName: response[i].alt_name,
          subStatus: response[i].status,
          analysis: response[i].analysis,
          archived: response[i].archived,
          ttc,
        };
        finalResponse.push(element);
      }
    }
    return finalResponse;
  },
  getSubmissionResults(submissionId: number | string, token: string) {
    if (typeof submissionId === "string") {
      throw new Error("Invalid submission ID");
    }

    // set authorization token
    client.defaults.headers.common.Authorization = `Token ${token}`;

    return client.get(`/submissions/submission_results/${submissionId}`);
  },
  getSubmissionErrors(submissionId: number | string) {
    if (typeof submissionId === "string") {
      return "Invalid submission ID";
    }
    return client
      .get(`/error/error_report/private/${submissionId}`)
      .then((response) => response.data);
  },
  updateName(
    token: string,
    userId: number,
    submissionId: number,
    altName: string
  ) {
    if (
      submissionId !== null &&
      submissionId !== undefined &&
      token !== null &&
      token !== undefined
    ) {
      const url = `/submissions/set_submission_name/${userId}/${submissionId}`;
      const data = { alt_name: altName };

      // set authorization token
      client.defaults.headers.common.Authorization = `Token ${token}`;

      // Return the Promise from client.post
      return client.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    }

    // If submissionId or token is null or undefined, return a rejected Promise
    return Promise.reject(
      new Error("submissionId and token cannot be null or undefined")
    );
  },
  archiveSubmission(
    token: string,
    userId: number,
    submissionId: number,
    archived: boolean
  ) {
    if (
      submissionId !== null &&
      submissionId !== undefined &&
      token !== null &&
      token !== undefined
    ) {
      const url = `/submissions/archive_submission/${userId}/${submissionId}`;
      const data = { archived: archived };

      // set authorization token
      client.defaults.headers.common.Authorization = `Token ${token}`;

      // Return the Promise from client.post
      return client.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    }

    // If submissionId or token is null or undefined, return a rejected Promise
    return Promise.reject(
      new Error("submissionId and token cannot be null or undefined")
    );
  },
};

export default SubmissionService;
