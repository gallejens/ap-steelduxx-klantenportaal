package com.ap.steelduxxklantenportaal.request;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.userrequestreview.CompanyApproveDto;
import com.ap.steelduxxklantenportaal.dtos.userrequestreview.UserRequestDenyDto;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;

public class UserRequestMotherObject {
        static final UserRequestDto request1 = new UserRequestDto(1, "Steelduxx", "Belgium", "+32471017865",
                        "BE 0425.069.935", "2000", "Antwerp", "Duboisstraat", "50", null, null, "Raf", "Vanhoegearden",
                        "info@steelduxx.eu", 1709034820358L,
                        StatusEnum.PENDING, null);

        static final UserRequestDto request2 = new UserRequestDto(2, "Vanhoegaerden", "Belgium", "+32471017865",
                        "BE 0479.253.937", "2900", "Schoten", "Heideweg", "12", null, null, "Raf", "Vanhoegearden",
                        "info@vanhoegaerden.eu", 1709034820358L,
                        StatusEnum.PENDING, null);

        static final CompanyApproveDto companyApprove = new CompanyApproveDto("referenceCode");

        static final UserRequestDenyDto companyDeny = new UserRequestDenyDto("Denial reason");

}
