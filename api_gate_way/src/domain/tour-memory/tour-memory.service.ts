import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { TourMemoryEntity } from 'src/config/database/models/tour-memory.entity';
import {
  FindTourMemoryOutboundPortOutputDto,
  InsertTourMemoryOutboundPortInputDto,
  TOUR_MEMORY_REPOSITORY_OUTBOUND_PORT,
  TourMemoryRepositoryOutboundPort,
} from 'src/ports-adapters/tour-memory/tour-memory.repository.outbound-port';

@Injectable()
export class TourMemoryService {
  constructor(
    @Inject(TOUR_MEMORY_REPOSITORY_OUTBOUND_PORT)
    private readonly tourMemoryRepository: TourMemoryRepositoryOutboundPort,
  ) {}

  async recordTourMemory(
    tourInfo: InsertTourMemoryOutboundPortInputDto,
  ): Promise<TourMemoryEntity> {
    const tourMemory = await this.tourMemoryRepository.insertTourMemory(
      tourInfo,
    );

    return tourMemory;
  }

  async readTourMemory(
    userId: number,
  ): Promise<FindTourMemoryOutboundPortOutputDto> {
    const tourMemoryList = await this.tourMemoryRepository.findTourMemoryList(
      userId,
    );

    return tourMemoryList;
  }

  async searchTourMemoryUsingChatGPT(
    userId: number,
    query: string,
  ): Promise<string> {
    // 유저 id를 기반으로 해당 유저의 여행 기록을 뽑아온다.
    const tourMemoryList = await this.tourMemoryRepository.findTourMemoryList(
      userId,
    );

    const input = {
      query,
      data: tourMemoryList.tourMemoryList,
    };

    const res = await axios.post<string>(
      'http://fastapi_server:8080/answer',
      input,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = res.data;

    return data;
  }
}
