/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/SequelizeMeta": {
    get: {
      parameters: {
        query: {
          name?: parameters["rowFilter.SequelizeMeta.name"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["SequelizeMeta"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** SequelizeMeta */
          SequelizeMeta?: definitions["SequelizeMeta"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          name?: parameters["rowFilter.SequelizeMeta.name"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          name?: parameters["rowFilter.SequelizeMeta.name"];
        };
        body: {
          /** SequelizeMeta */
          SequelizeMeta?: definitions["SequelizeMeta"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/answers": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.answers.id"];
          schedule_id?: parameters["rowFilter.answers.schedule_id"];
          profile_id?: parameters["rowFilter.answers.profile_id"];
          question_id?: parameters["rowFilter.answers.question_id"];
          value?: parameters["rowFilter.answers.value"];
          created_at?: parameters["rowFilter.answers.created_at"];
          updated_at?: parameters["rowFilter.answers.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["answers"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** answers */
          answers?: definitions["answers"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.answers.id"];
          schedule_id?: parameters["rowFilter.answers.schedule_id"];
          profile_id?: parameters["rowFilter.answers.profile_id"];
          question_id?: parameters["rowFilter.answers.question_id"];
          value?: parameters["rowFilter.answers.value"];
          created_at?: parameters["rowFilter.answers.created_at"];
          updated_at?: parameters["rowFilter.answers.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.answers.id"];
          schedule_id?: parameters["rowFilter.answers.schedule_id"];
          profile_id?: parameters["rowFilter.answers.profile_id"];
          question_id?: parameters["rowFilter.answers.question_id"];
          value?: parameters["rowFilter.answers.value"];
          created_at?: parameters["rowFilter.answers.created_at"];
          updated_at?: parameters["rowFilter.answers.updated_at"];
        };
        body: {
          /** answers */
          answers?: definitions["answers"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/organizations": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.organizations.id"];
          name?: parameters["rowFilter.organizations.name"];
          address?: parameters["rowFilter.organizations.address"];
          pic_name?: parameters["rowFilter.organizations.pic_name"];
          phone?: parameters["rowFilter.organizations.phone"];
          email?: parameters["rowFilter.organizations.email"];
          created_at?: parameters["rowFilter.organizations.created_at"];
          updated_at?: parameters["rowFilter.organizations.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["organizations"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** organizations */
          organizations?: definitions["organizations"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.organizations.id"];
          name?: parameters["rowFilter.organizations.name"];
          address?: parameters["rowFilter.organizations.address"];
          pic_name?: parameters["rowFilter.organizations.pic_name"];
          phone?: parameters["rowFilter.organizations.phone"];
          email?: parameters["rowFilter.organizations.email"];
          created_at?: parameters["rowFilter.organizations.created_at"];
          updated_at?: parameters["rowFilter.organizations.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.organizations.id"];
          name?: parameters["rowFilter.organizations.name"];
          address?: parameters["rowFilter.organizations.address"];
          pic_name?: parameters["rowFilter.organizations.pic_name"];
          phone?: parameters["rowFilter.organizations.phone"];
          email?: parameters["rowFilter.organizations.email"];
          created_at?: parameters["rowFilter.organizations.created_at"];
          updated_at?: parameters["rowFilter.organizations.updated_at"];
        };
        body: {
          /** organizations */
          organizations?: definitions["organizations"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/packages": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.packages.id"];
          name?: parameters["rowFilter.packages.name"];
          created_at?: parameters["rowFilter.packages.created_at"];
          updated_at?: parameters["rowFilter.packages.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["packages"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** packages */
          packages?: definitions["packages"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.packages.id"];
          name?: parameters["rowFilter.packages.name"];
          created_at?: parameters["rowFilter.packages.created_at"];
          updated_at?: parameters["rowFilter.packages.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.packages.id"];
          name?: parameters["rowFilter.packages.name"];
          created_at?: parameters["rowFilter.packages.created_at"];
          updated_at?: parameters["rowFilter.packages.updated_at"];
        };
        body: {
          /** packages */
          packages?: definitions["packages"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/participants": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.participants.id"];
          schedule_id?: parameters["rowFilter.participants.schedule_id"];
          profile_id?: parameters["rowFilter.participants.profile_id"];
          created_at?: parameters["rowFilter.participants.created_at"];
          updated_at?: parameters["rowFilter.participants.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["participants"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** participants */
          participants?: definitions["participants"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.participants.id"];
          schedule_id?: parameters["rowFilter.participants.schedule_id"];
          profile_id?: parameters["rowFilter.participants.profile_id"];
          created_at?: parameters["rowFilter.participants.created_at"];
          updated_at?: parameters["rowFilter.participants.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.participants.id"];
          schedule_id?: parameters["rowFilter.participants.schedule_id"];
          profile_id?: parameters["rowFilter.participants.profile_id"];
          created_at?: parameters["rowFilter.participants.created_at"];
          updated_at?: parameters["rowFilter.participants.updated_at"];
        };
        body: {
          /** participants */
          participants?: definitions["participants"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/profiles": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.profiles.id"];
          name?: parameters["rowFilter.profiles.name"];
          gender?: parameters["rowFilter.profiles.gender"];
          identity?: parameters["rowFilter.profiles.identity"];
          birth_date?: parameters["rowFilter.profiles.birth_date"];
          email?: parameters["rowFilter.profiles.email"];
          address?: parameters["rowFilter.profiles.address"];
          photo_url?: parameters["rowFilter.profiles.photo_url"];
          created_at?: parameters["rowFilter.profiles.created_at"];
          updated_at?: parameters["rowFilter.profiles.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["profiles"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** profiles */
          profiles?: definitions["profiles"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.profiles.id"];
          name?: parameters["rowFilter.profiles.name"];
          gender?: parameters["rowFilter.profiles.gender"];
          identity?: parameters["rowFilter.profiles.identity"];
          birth_date?: parameters["rowFilter.profiles.birth_date"];
          email?: parameters["rowFilter.profiles.email"];
          address?: parameters["rowFilter.profiles.address"];
          photo_url?: parameters["rowFilter.profiles.photo_url"];
          created_at?: parameters["rowFilter.profiles.created_at"];
          updated_at?: parameters["rowFilter.profiles.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.profiles.id"];
          name?: parameters["rowFilter.profiles.name"];
          gender?: parameters["rowFilter.profiles.gender"];
          identity?: parameters["rowFilter.profiles.identity"];
          birth_date?: parameters["rowFilter.profiles.birth_date"];
          email?: parameters["rowFilter.profiles.email"];
          address?: parameters["rowFilter.profiles.address"];
          photo_url?: parameters["rowFilter.profiles.photo_url"];
          created_at?: parameters["rowFilter.profiles.created_at"];
          updated_at?: parameters["rowFilter.profiles.updated_at"];
        };
        body: {
          /** profiles */
          profiles?: definitions["profiles"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/questions": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.questions.id"];
          package_id?: parameters["rowFilter.questions.package_id"];
          section_id?: parameters["rowFilter.questions.section_id"];
          number?: parameters["rowFilter.questions.number"];
          text?: parameters["rowFilter.questions.text"];
          question?: parameters["rowFilter.questions.question"];
          options?: parameters["rowFilter.questions.options"];
          keys?: parameters["rowFilter.questions.keys"];
          created_at?: parameters["rowFilter.questions.created_at"];
          updated_at?: parameters["rowFilter.questions.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["questions"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** questions */
          questions?: definitions["questions"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.questions.id"];
          package_id?: parameters["rowFilter.questions.package_id"];
          section_id?: parameters["rowFilter.questions.section_id"];
          number?: parameters["rowFilter.questions.number"];
          text?: parameters["rowFilter.questions.text"];
          question?: parameters["rowFilter.questions.question"];
          options?: parameters["rowFilter.questions.options"];
          keys?: parameters["rowFilter.questions.keys"];
          created_at?: parameters["rowFilter.questions.created_at"];
          updated_at?: parameters["rowFilter.questions.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.questions.id"];
          package_id?: parameters["rowFilter.questions.package_id"];
          section_id?: parameters["rowFilter.questions.section_id"];
          number?: parameters["rowFilter.questions.number"];
          text?: parameters["rowFilter.questions.text"];
          question?: parameters["rowFilter.questions.question"];
          options?: parameters["rowFilter.questions.options"];
          keys?: parameters["rowFilter.questions.keys"];
          created_at?: parameters["rowFilter.questions.created_at"];
          updated_at?: parameters["rowFilter.questions.updated_at"];
        };
        body: {
          /** questions */
          questions?: definitions["questions"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/schedules": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.schedules.id"];
          package_id?: parameters["rowFilter.schedules.package_id"];
          organization_id?: parameters["rowFilter.schedules.organization_id"];
          name?: parameters["rowFilter.schedules.name"];
          exam_date?: parameters["rowFilter.schedules.exam_date"];
          url?: parameters["rowFilter.schedules.url"];
          created_at?: parameters["rowFilter.schedules.created_at"];
          updated_at?: parameters["rowFilter.schedules.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["schedules"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** schedules */
          schedules?: definitions["schedules"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.schedules.id"];
          package_id?: parameters["rowFilter.schedules.package_id"];
          organization_id?: parameters["rowFilter.schedules.organization_id"];
          name?: parameters["rowFilter.schedules.name"];
          exam_date?: parameters["rowFilter.schedules.exam_date"];
          url?: parameters["rowFilter.schedules.url"];
          created_at?: parameters["rowFilter.schedules.created_at"];
          updated_at?: parameters["rowFilter.schedules.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.schedules.id"];
          package_id?: parameters["rowFilter.schedules.package_id"];
          organization_id?: parameters["rowFilter.schedules.organization_id"];
          name?: parameters["rowFilter.schedules.name"];
          exam_date?: parameters["rowFilter.schedules.exam_date"];
          url?: parameters["rowFilter.schedules.url"];
          created_at?: parameters["rowFilter.schedules.created_at"];
          updated_at?: parameters["rowFilter.schedules.updated_at"];
        };
        body: {
          /** schedules */
          schedules?: definitions["schedules"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/sections": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.sections.id"];
          package_id?: parameters["rowFilter.sections.package_id"];
          number?: parameters["rowFilter.sections.number"];
          titles?: parameters["rowFilter.sections.titles"];
          context?: parameters["rowFilter.sections.context"];
          start_time?: parameters["rowFilter.sections.start_time"];
          end_time?: parameters["rowFilter.sections.end_time"];
          created_at?: parameters["rowFilter.sections.created_at"];
          updated_at?: parameters["rowFilter.sections.updated_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["sections"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** sections */
          sections?: definitions["sections"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.sections.id"];
          package_id?: parameters["rowFilter.sections.package_id"];
          number?: parameters["rowFilter.sections.number"];
          titles?: parameters["rowFilter.sections.titles"];
          context?: parameters["rowFilter.sections.context"];
          start_time?: parameters["rowFilter.sections.start_time"];
          end_time?: parameters["rowFilter.sections.end_time"];
          created_at?: parameters["rowFilter.sections.created_at"];
          updated_at?: parameters["rowFilter.sections.updated_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.sections.id"];
          package_id?: parameters["rowFilter.sections.package_id"];
          number?: parameters["rowFilter.sections.number"];
          titles?: parameters["rowFilter.sections.titles"];
          context?: parameters["rowFilter.sections.context"];
          start_time?: parameters["rowFilter.sections.start_time"];
          end_time?: parameters["rowFilter.sections.end_time"];
          created_at?: parameters["rowFilter.sections.created_at"];
          updated_at?: parameters["rowFilter.sections.updated_at"];
        };
        body: {
          /** sections */
          sections?: definitions["sections"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/rpc/get_questions_by_schedule": {
    post: {
      parameters: {
        body: {
          args: {
            id_of_schedule: number;
          };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/rpc/handle_new_user": {
    post: {
      parameters: {
        body: {
          args: { [key: string]: any };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/rpc/handle_user_deletion": {
    post: {
      parameters: {
        body: {
          args: { [key: string]: any };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/rpc/handle_new_participant": {
    post: {
      parameters: {
        body: {
          args: {
            id_of_profile: string;
            id_of_schedule: number;
          };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
}

export interface definitions {
  SequelizeMeta: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    name: string;
  };
  answers: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string;
    /**
     * Note:
     * This is a Foreign Key to `schedules.id`.<fk table='schedules' column='id'/>
     */
    schedule_id: number;
    /**
     * Note:
     * This is a Foreign Key to `profiles.id`.<fk table='profiles' column='id'/>
     */
    profile_id: string;
    question_id: string;
    value: string;
    created_at: string;
    updated_at?: string;
  };
  organizations: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    name: string;
    address: string;
    pic_name: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at?: string;
  };
  packages: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string;
    name: string;
    created_at: string;
    updated_at?: string;
  };
  participants: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    /**
     * Note:
     * This is a Foreign Key to `schedules.id`.<fk table='schedules' column='id'/>
     */
    schedule_id: number;
    /**
     * Note:
     * This is a Foreign Key to `profiles.id`.<fk table='profiles' column='id'/>
     */
    profile_id: string;
    created_at: string;
    updated_at: string;
  };
  profiles: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     * This is a Foreign Key to `users.id`.<fk table='users' column='id'/>
     */
    id: string;
    name?: string;
    gender?: string;
    identity?: string;
    birth_date?: string;
    email: string;
    address?: string;
    photo_url?: string;
    created_at: string;
    updated_at?: string;
  };
  questions: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string;
    /**
     * Note:
     * This is a Foreign Key to `packages.id`.<fk table='packages' column='id'/>
     */
    package_id: string;
    /**
     * Note:
     * This is a Foreign Key to `sections.id`.<fk table='sections' column='id'/>
     */
    section_id: string;
    number: number;
    text: string;
    question: string;
    options: string;
    keys: string;
    created_at?: string;
    updated_at?: string;
  };
  schedules: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    /**
     * Note:
     * This is a Foreign Key to `packages.id`.<fk table='packages' column='id'/>
     */
    package_id: string;
    /**
     * Note:
     * This is a Foreign Key to `organizations.id`.<fk table='organizations' column='id'/>
     */
    organization_id: number;
    name: string;
    exam_date: string;
    url: string;
    created_at: string;
    updated_at?: string;
  };
  sections: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string;
    /**
     * Note:
     * This is a Foreign Key to `packages.id`.<fk table='packages' column='id'/>
     */
    package_id: string;
    number: number;
    titles: string;
    context: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at?: string;
  };
}

export interface parameters {
  /** Preference */
  preferParams: "params=single-object";
  /** Preference */
  preferReturn: "return=representation" | "return=minimal" | "return=none";
  /** Preference */
  preferCount: "count=none";
  /** Filtering Columns */
  select: string;
  /** On Conflict */
  on_conflict: string;
  /** Ordering */
  order: string;
  /** Limiting and Pagination */
  range: string;
  /** Limiting and Pagination */
  rangeUnit: string;
  /** Limiting and Pagination */
  offset: string;
  /** Limiting and Pagination */
  limit: string;
  /** SequelizeMeta */
  "body.SequelizeMeta": definitions["SequelizeMeta"];
  "rowFilter.SequelizeMeta.name": string;
  /** answers */
  "body.answers": definitions["answers"];
  "rowFilter.answers.id": string;
  "rowFilter.answers.schedule_id": string;
  "rowFilter.answers.profile_id": string;
  "rowFilter.answers.question_id": string;
  "rowFilter.answers.value": string;
  "rowFilter.answers.created_at": string;
  "rowFilter.answers.updated_at": string;
  /** organizations */
  "body.organizations": definitions["organizations"];
  "rowFilter.organizations.id": string;
  "rowFilter.organizations.name": string;
  "rowFilter.organizations.address": string;
  "rowFilter.organizations.pic_name": string;
  "rowFilter.organizations.phone": string;
  "rowFilter.organizations.email": string;
  "rowFilter.organizations.created_at": string;
  "rowFilter.organizations.updated_at": string;
  /** packages */
  "body.packages": definitions["packages"];
  "rowFilter.packages.id": string;
  "rowFilter.packages.name": string;
  "rowFilter.packages.created_at": string;
  "rowFilter.packages.updated_at": string;
  /** participants */
  "body.participants": definitions["participants"];
  "rowFilter.participants.id": string;
  "rowFilter.participants.schedule_id": string;
  "rowFilter.participants.profile_id": string;
  "rowFilter.participants.created_at": string;
  "rowFilter.participants.updated_at": string;
  /** profiles */
  "body.profiles": definitions["profiles"];
  "rowFilter.profiles.id": string;
  "rowFilter.profiles.name": string;
  "rowFilter.profiles.gender": string;
  "rowFilter.profiles.identity": string;
  "rowFilter.profiles.birth_date": string;
  "rowFilter.profiles.email": string;
  "rowFilter.profiles.address": string;
  "rowFilter.profiles.photo_url": string;
  "rowFilter.profiles.created_at": string;
  "rowFilter.profiles.updated_at": string;
  /** questions */
  "body.questions": definitions["questions"];
  "rowFilter.questions.id": string;
  "rowFilter.questions.package_id": string;
  "rowFilter.questions.section_id": string;
  "rowFilter.questions.number": string;
  "rowFilter.questions.text": string;
  "rowFilter.questions.question": string;
  "rowFilter.questions.options": string;
  "rowFilter.questions.keys": string;
  "rowFilter.questions.created_at": string;
  "rowFilter.questions.updated_at": string;
  /** schedules */
  "body.schedules": definitions["schedules"];
  "rowFilter.schedules.id": string;
  "rowFilter.schedules.package_id": string;
  "rowFilter.schedules.organization_id": string;
  "rowFilter.schedules.name": string;
  "rowFilter.schedules.exam_date": string;
  "rowFilter.schedules.url": string;
  "rowFilter.schedules.created_at": string;
  "rowFilter.schedules.updated_at": string;
  /** sections */
  "body.sections": definitions["sections"];
  "rowFilter.sections.id": string;
  "rowFilter.sections.package_id": string;
  "rowFilter.sections.number": string;
  "rowFilter.sections.titles": string;
  "rowFilter.sections.context": string;
  "rowFilter.sections.start_time": string;
  "rowFilter.sections.end_time": string;
  "rowFilter.sections.created_at": string;
  "rowFilter.sections.updated_at": string;
}

export interface operations {}

export interface external {}
